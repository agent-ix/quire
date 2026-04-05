import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { QuireProvider } from "../../src/react/QuireProvider";
import {
  useStandardsAlignment,
  groupDependencies,
  parseADRFromContent,
  extractFRDiagrams,
} from "../../src/react/extensions";

// ─── useStandardsAlignment (FR-021) ─────────────────────────────────────

describe("useStandardsAlignment (FR-021)", () => {
  const standards = [
    { id: "std-1", name: "ISO/IEC/IEEE 29148", code: "iso-29148" },
    { id: "std-2", name: "IEEE 828",           code: "ieee-828" },
  ];

  function wrapper(md: string) {
    return function W({ children }: { children: ReactNode }) {
      return <QuireProvider content={md}>{children}</QuireProvider>;
    };
  }

  it("FR-021-AC-1: resolves code by code field", () => {
    const md = "---\nstandards_alignment: [iso-29148]\n---\n## Content";
    const { result } = renderHook(() => useStandardsAlignment(standards), {
      wrapper: wrapper(md),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].resolved).toBe(true);
    expect(result.current[0].id).toBe("std-1");
    expect(result.current[0].name).toBe("ISO/IEC/IEEE 29148");
  });

  it("FR-021-AC-2: unresolvable code has resolved=false, code preserved", () => {
    const md = "---\nstandards_alignment: [unknown-standard]\n---\n## Content";
    const { result } = renderHook(() => useStandardsAlignment(standards), {
      wrapper: wrapper(md),
    });

    expect(result.current[0].resolved).toBe(false);
    expect(result.current[0].code).toBe("unknown-standard");
    expect(result.current[0].id).toBeNull();
  });

  it("returns empty when no standards_alignment in frontmatter", () => {
    const md = "---\nfoo: bar\n---\n## Content";
    const { result } = renderHook(() => useStandardsAlignment(standards), {
      wrapper: wrapper(md),
    });
    expect(result.current).toHaveLength(0);
  });
});

// ─── groupDependencies (FR-023) ──────────────────────────────────────────

describe("groupDependencies (FR-023)", () => {
  const deps = [
    { name: "auth-service", repo_type: "service" },
    { name: "ui-lib", repo_type: "lib" },
    { name: "dashboard", repo_type: "web-app" },
  ];

  const groups = [
    { key: "services", label: "Services", filter: (d: typeof deps[0]) => d.repo_type === "service" },
    { key: "libs",     label: "Libraries", filter: (d: typeof deps[0]) => d.repo_type === "lib" },
    { key: "ui",       label: "UI",        filter: (d: typeof deps[0]) => d.repo_type === "web-app" },
  ];

  it("FR-023-AC-1: classifies dependencies by filter", () => {
    const result = groupDependencies(deps, groups);
    expect(result[0].items).toHaveLength(1);
    expect(result[0].items[0].name).toBe("auth-service");
    expect(result[1].items[0].name).toBe("ui-lib");
    expect(result[2].items[0].name).toBe("dashboard");
  });

  it("FR-028-AC-4: filter errors exclude item and log error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const badGroups = [
      {
        key: "bad",
        label: "Bad",
        filter: (_dep: typeof deps[0]) => { throw new Error("filter boom"); },
      },
    ];
    const result = groupDependencies(deps, badGroups);
    expect(result[0].items).toHaveLength(0);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ─── parseADRFromContent (FR-022) ────────────────────────────────────────

describe("parseADRFromContent (FR-022)", () => {
  it("extracts ADR sections", () => {
    const content = [
      "## Context",
      "We needed to choose a database.",
      "## Decision",
      "Use PostgreSQL.",
      "## Rationale",
      "Battle-tested and reliable.",
      "Status: Accepted",
    ].join("\n");

    const adr = parseADRFromContent(content);
    expect(adr).not.toBeNull();
    expect(adr!.context).toContain("choose a database");
    expect(adr!.decision).toContain("PostgreSQL");
    expect(adr!.status).toBe("Accepted");
  });

  it("defaults status to Accepted when missing", () => {
    const content = "## Context\nsome context\n## Decision\ndo it";
    const adr = parseADRFromContent(content);
    expect(adr!.status).toBe("Accepted");
  });

  it("returns null for empty content", () => {
    const adr = parseADRFromContent("");
    expect(adr).toBeNull();
  });
});

// ─── extractFRDiagrams (US-018) ──────────────────────────────────────────

describe("extractFRDiagrams (US-018)", () => {
  it("extracts mermaid from FR artifacts", () => {
    const artifacts = [
      { id: "FR-001", title: "Parse Document", content: "Some FR\n```mermaid\ngraph TD\n  A\n```" },
      { id: "FR-002", title: "Query", content: "No diagram here" },
    ];

    const result = extractFRDiagrams(artifacts);
    expect(result).toHaveLength(1);
    expect(result[0].frId).toBe("FR-001");
    expect(result[0].source).toContain("A");
  });
});
