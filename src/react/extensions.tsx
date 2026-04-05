/**
 * FR-021: Standards Resolution from Frontmatter
 * FR-022: ADR Parsing
 * FR-023: Grouped Dependency Renderer
 *
 * Additional hooks and utilities for Application/Standard views.
 */
import { useMemo } from "react";
import { useFrontmatter, useQuire } from "./QuireProvider";
import { extractDiagrams, parseBulletList } from "../core/query";

// ─── FR-021: Standards Resolution ──────────────────────────────────────

/** A standard record — minimal shape required for resolution. */
export interface StandardRecord {
  id: string;
  name: string;
  code?: string;
}

/** A resolved standard entry. */
export interface ResolvedStandard {
  /** Raw code from frontmatter (e.g. "iso-29148") */
  code: string;
  /** Database ID if resolved, null if not */
  id: string | null;
  /** Full name if resolved, null if not */
  name: string | null;
  /** Whether the code was found in the standards database */
  resolved: boolean;
}

/**
 * Resolves standards_alignment codes from frontmatter against a standards list.
 *
 * FR-021-AC-1: Resolved standard has id+name populated.
 * FR-021-AC-2: Unresolvable code has resolved=false, code preserved.
 * FR-021-AC-3: Match by code, id, or name (case-insensitive).
 */
export function useStandardsAlignment(
  standards: StandardRecord[]
): ResolvedStandard[] {
  const fm = useFrontmatter<{ standards_alignment?: string[] }>();

  return useMemo(() => {
    const codes: string[] = fm?.standards_alignment ?? [];
    if (codes.length === 0) return [];

    return codes.map((code): ResolvedStandard => {
      const codeNorm = code.toLowerCase().trim();
      const match = standards.find((s) => {
        return (
          s.code?.toLowerCase() === codeNorm ||
          s.id.toLowerCase() === codeNorm ||
          s.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === codeNorm
        );
      });

      if (match) {
        return {
          code,
          id: match.id,
          name: match.name,
          resolved: true,
        };
      }

      return { code, id: null, name: null, resolved: false };
    });
  }, [fm, standards]);
}

// ─── FR-022: ADR Parsing ────────────────────────────────────────────────

/** A parsed Architecture Decision Record. */
export interface ParsedADR {
  id: string;
  title: string;
  context: string | null;
  decision: string | null;
  rationale: string | null;
  status: string;
  /** Mermaid diagrams embedded in the ADR. */
  diagrams: string[];
}

/**
 * Parse an ADR from the parent document's sections, looking for ADR-style sections.
 * Each top-level section is examined for ADR sub-sections.
 */
export function parseADRFromContent(content: string): ParsedADR | null {
  if (!content.trim()) return null;

  const getSubSection = (heading: string): string | null => {
    const regex = new RegExp(
      `#{2,4}\\s+${heading}[^\\n]*\\n([\\s\\S]*?)(?=\\n#{1,4}\\s|$)`,
      "i"
    );
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };

  const context = getSubSection("Context");
  const decision = getSubSection("Decision");
  const rationale = getSubSection("Rationale");
  const statusMatch = content.match(/Status[:\s]+([A-Za-z]+)/i);
  const status = statusMatch ? statusMatch[1] : "Accepted";

  // Extract mermaid diagrams from the ADR content
  const diagrams: string[] = [];
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = mermaidRegex.exec(content)) !== null) {
    diagrams.push(m[1].trim());
  }

  return { id: "", title: "", context, decision, rationale, status, diagrams };
}

// ─── FR-023: Grouped Dependencies ──────────────────────────────────────

/** A dependency item for grouping. */
export interface DependencySummary {
  name: string;
  repo_type?: string;
  element_id?: string;
  description?: string;
  [key: string]: unknown;
}

/** A group definition for GroupedDependencies. */
export interface DependencyGroup<T extends DependencySummary = DependencySummary> {
  key: string;
  label: string;
  filter: (dep: T) => boolean;
}

/** Result of grouping. */
export type GroupedResult<T extends DependencySummary = DependencySummary> = {
  key: string;
  label: string;
  items: T[];
};

/**
 * Group a list of dependencies by custom filter functions (FR-023).
 *
 * FR-023-AC-1: Dependencies classified by filter functions.
 * FR-028-AC-4: Filter errors cause item to be excluded from all groups.
 */
export function groupDependencies<T extends DependencySummary>(
  dependencies: T[],
  groups: DependencyGroup<T>[]
): GroupedResult<T>[] {
  return groups.map((group) => {
    const items = dependencies.filter((dep) => {
      try {
        return group.filter(dep);
      } catch (err) {
        // FR-028-AC-4: Resilient — exclude item from group, log error
        console.error(
          `[Quire] GroupedDependencies filter error for "${group.key}":`,
          err
        );
        return false;
      }
    });
    return { key: group.key, label: group.label, items };
  });
}

/**
 * Hook version of groupDependencies.
 */
export function useGroupedDependencies<T extends DependencySummary>(
  dependencies: T[],
  groups: DependencyGroup<T>[]
): GroupedResult<T>[] {
  return useMemo(
    () => groupDependencies(dependencies, groups),
    [dependencies, groups]
  );
}

// ─── FR-025-compatible: FR process diagram extraction ─────────────────

/** Extract diagrams from a set of FR artifacts. */
export interface FRDiagram {
  frId: string;
  frTitle: string;
  source: string;
}

/**
 * Scan artifact contents for FR process diagrams (US-018).
 */
export function extractFRDiagrams(
  artifacts: Array<{ id: string; title: string; content: string }>
): FRDiagram[] {
  const result: FRDiagram[] = [];
  for (const artifact of artifacts) {
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let m: RegExpExecArray | null;
    while ((m = mermaidRegex.exec(artifact.content)) !== null) {
      result.push({
        frId: artifact.id,
        frTitle: artifact.title,
        source: m[1].trim(),
      });
    }
  }
  return result;
}
