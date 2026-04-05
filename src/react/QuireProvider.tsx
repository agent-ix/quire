/**
 * FR-008: QuireProvider React Context
 * FR-009: useSection Hook
 * FR-010: useTable Hook
 * FR-011: useList Hook
 * FR-012: useFrontmatter Hook
 * FR-013: useDiagram Hook
 */
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type {
  QuireDocument,
  QuireSection,
  TableResult,
  ListItem,
  DiagramBlock,
  ListPattern,
} from "../core/types";
import { parseDocument } from "../core/parser";
import {
  section,
  parseTable,
  parseBulletList,
  extractDiagrams,
} from "../core/query";
import { updateSection } from "../core/writeback";

// ─── Context ────────────────────────────────────────────────────────────

interface QuireContextValue {
  document: QuireDocument;
  onChange?: (markdown: string) => void;
}

const QuireContext = createContext<QuireContextValue | null>(null);

/** Error thrown when hooks are used outside QuireProvider (FR-009-AC-4). */
export class QuireContextError extends Error {
  constructor() {
    super(
      "Quire hooks must be used within a <QuireProvider>. " +
        "Wrap your component tree with <QuireProvider content={markdown}>."
    );
    this.name = "QuireContextError";
  }
}

function useQuireContext(): QuireContextValue {
  const ctx = useContext(QuireContext);
  if (!ctx) throw new QuireContextError();
  return ctx;
}

// ─── Provider (FR-008) ──────────────────────────────────────────────────

export interface QuireProviderProps {
  /** Raw markdown content to parse. */
  content: string;
  /** Called when a section is updated via write-back. */
  onChange?: (markdown: string) => void;
  children: ReactNode;
}

/**
 * QuireProvider — parses markdown content and provides it via context.
 *
 * FR-008-AC-1: parseDocument() called and available via hooks.
 * FR-008-AC-2: Re-parses when content changes.
 * FR-008-AC-4: Parsing is memoized.
 */
export function QuireProvider({
  content,
  onChange,
  children,
}: QuireProviderProps) {
  // FR-008-AC-4: Memoize parse — identical content won't re-parse
  const document = useMemo(() => parseDocument(content), [content]);

  const value = useMemo(
    () => ({ document, onChange }),
    [document, onChange]
  );

  return (
    <QuireContext.Provider value={value}>{children}</QuireContext.Provider>
  );
}

// ─── useQuire (raw access) ──────────────────────────────────────────────

/**
 * Access the full parsed QuireDocument.
 */
export function useQuire(): QuireDocument {
  return useQuireContext().document;
}

// ─── useSection (FR-009) ────────────────────────────────────────────────

export interface UseSectionResult {
  content: string | null;
  section: QuireSection | null;
  /** Update this section's content and trigger onChange. */
  update: (newContent: string) => void;
}

/**
 * Access a specific section by heading.
 *
 * FR-009-AC-1: Returns content for valid heading.
 * FR-009-AC-2: Returns null for non-existent heading.
 */
export function useSection(heading: string): UseSectionResult {
  const { document: doc, onChange } = useQuireContext();

  return useMemo(() => {
    const s = section(doc, heading);
    return {
      content: s?.content ?? null,
      section: s ?? null,
      update: (newContent: string) => {
        if (onChange) {
          const updated = updateSection(doc, heading, newContent);
          onChange(updated);
        }
      },
    };
  }, [doc, heading, onChange]);
}

// ─── useTable (FR-010) ──────────────────────────────────────────────────

/**
 * Extract the first table from a named section.
 *
 * FR-010-AC-1: Returns TableResult for the section.
 * FR-010-AC-2: Returns empty if no table.
 */
export function useTable(heading: string): TableResult {
  const { document: doc } = useQuireContext();

  return useMemo(() => {
    const s = section(doc, heading);
    if (!s) return { headers: [], rows: [] };
    return parseTable(s.content);
  }, [doc, heading]);
}

// ─── useList (FR-011) ───────────────────────────────────────────────────

/**
 * Extract a bullet list from a named section.
 *
 * FR-011-AC-1: Returns parsed items.
 * FR-011-AC-2: Applies pattern for title/description splitting.
 */
export function useList(
  heading: string,
  opts?: { pattern?: ListPattern }
): ListItem[] {
  const { document: doc } = useQuireContext();

  return useMemo(() => {
    const s = section(doc, heading);
    if (!s) return [];
    return parseBulletList(s.content, opts);
  }, [doc, heading, opts]);
}

// ─── useFrontmatter (FR-012) ────────────────────────────────────────────

/**
 * Access the parsed frontmatter.
 *
 * FR-012-AC-1: Returns frontmatter object.
 * FR-012-AC-2: Returns null if none.
 */
export function useFrontmatter<T = Record<string, unknown>>(): T | null {
  const { document: doc } = useQuireContext();
  return (doc.frontmatter as T) ?? null;
}

// ─── useDiagram (FR-013) ────────────────────────────────────────────────

/**
 * Extract diagrams, optionally from a specific section.
 *
 * FR-013-AC-1: No heading → all diagrams.
 * FR-013-AC-2: With heading → only that section's diagrams.
 */
export function useDiagram(heading?: string): DiagramBlock[] {
  const { document: doc } = useQuireContext();

  return useMemo(() => {
    const all = extractDiagrams(doc);
    if (!heading) return all;
    return all.filter(
      (d) => d.section?.toLowerCase() === heading.toLowerCase()
    );
  }, [doc, heading]);
}
