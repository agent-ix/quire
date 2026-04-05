import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  QuireProvider,
  QuireContextError,
  useQuire,
  useSection,
  useTable,
  useList,
  useFrontmatter,
  useDiagram,
} from "../../src/react/QuireProvider";

// Wrapper helper
function wrapper(content: string, onChange?: (md: string) => void) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QuireProvider content={content} onChange={onChange}>
        {children}
      </QuireProvider>
    );
  };
}

// ─── QuireProvider (FR-008) ─────────────────────────────────────────────

describe("QuireProvider (FR-008)", () => {
  it("FR-008-AC-1: parses content and provides via hooks", () => {
    const md = "## Purpose\nTest content";
    const { result } = renderHook(() => useQuire(), {
      wrapper: wrapper(md),
    });

    expect(result.current.sections).toHaveLength(1);
    expect(result.current.sections[0].heading).toBe("Purpose");
  });

  it("FR-008-AC-2: re-parses on content change", () => {
    const md1 = "## A\ncontent a";
    const { result, rerender } = renderHook(() => useQuire(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QuireProvider content={md1}>{children}</QuireProvider>
      ),
    });

    expect(result.current.sections[0].heading).toBe("A");
  });
});

// ─── useSection (FR-009) ────────────────────────────────────────────────

describe("useSection (FR-009)", () => {
  it("FR-009-AC-1: returns content for valid heading", () => {
    const md = "## Purpose\nThis is the purpose";
    const { result } = renderHook(() => useSection("Purpose"), {
      wrapper: wrapper(md),
    });

    expect(result.current.content).toBe("This is the purpose");
    expect(result.current.section).not.toBeNull();
  });

  it("FR-009-AC-2: returns null for non-existent heading", () => {
    const md = "## Purpose\ncontent";
    const { result } = renderHook(() => useSection("Missing"), {
      wrapper: wrapper(md),
    });

    expect(result.current.content).toBeNull();
    expect(result.current.section).toBeNull();
  });

  it("FR-009-AC-4: throws outside QuireProvider", () => {
    expect(() => {
      renderHook(() => useSection("test"));
    }).toThrow(QuireContextError);
  });

  it("update() calls onChange with updated markdown", () => {
    const onChange = vi.fn();
    const md = "## Purpose\nold content\n## Scope\nscope";
    const { result } = renderHook(() => useSection("Purpose"), {
      wrapper: wrapper(md, onChange),
    });

    result.current.update("new content");
    expect(onChange).toHaveBeenCalledOnce();
    const updatedMd = onChange.mock.calls[0][0];
    expect(updatedMd).toContain("new content");
    expect(updatedMd).toContain("## Scope");
  });
});

// ─── useTable (FR-010) ──────────────────────────────────────────────────

describe("useTable (FR-010)", () => {
  it("FR-010-AC-1: extracts table from section", () => {
    const md = "## API\n| Method | Path |\n|---|---|\n| GET | /api |";
    const { result } = renderHook(() => useTable("API"), {
      wrapper: wrapper(md),
    });

    expect(result.current.headers).toEqual(["Method", "Path"]);
    expect(result.current.rows[0]).toEqual(["GET", "/api"]);
  });

  it("FR-010-AC-2: returns empty for missing section", () => {
    const md = "## Other\ncontent";
    const { result } = renderHook(() => useTable("Missing"), {
      wrapper: wrapper(md),
    });

    expect(result.current.headers).toEqual([]);
  });
});

// ─── useList (FR-011) ───────────────────────────────────────────────────

describe("useList (FR-011)", () => {
  it("FR-011-AC-1: extracts list items", () => {
    const md = "## Features\n- **Auth** — Token based\n- **Cache** — Redis";
    const { result } = renderHook(() => useList("Features"), {
      wrapper: wrapper(md),
    });

    expect(result.current).toHaveLength(2);
    expect(result.current[0].title).toBe("Auth");
    expect(result.current[0].description).toBe("Token based");
  });
});

// ─── useFrontmatter (FR-012) ────────────────────────────────────────────

describe("useFrontmatter (FR-012)", () => {
  it("FR-012-AC-1: returns frontmatter object", () => {
    const md = "---\nfoo: bar\n---\n## Content\nbody";
    const { result } = renderHook(() => useFrontmatter(), {
      wrapper: wrapper(md),
    });

    expect(result.current).toEqual({ foo: "bar" });
  });

  it("FR-012-AC-2: returns null when no frontmatter", () => {
    const md = "## Content\nbody";
    const { result } = renderHook(() => useFrontmatter(), {
      wrapper: wrapper(md),
    });

    expect(result.current).toBeNull();
  });
});

// ─── useDiagram (FR-013) ────────────────────────────────────────────────

describe("useDiagram (FR-013)", () => {
  it("FR-013-AC-1: returns all diagrams", () => {
    const md = "## Arch\n```mermaid\ngraph TD\n  A --> B\n```";
    const { result } = renderHook(() => useDiagram(), {
      wrapper: wrapper(md),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].language).toBe("mermaid");
  });

  it("FR-013-AC-2: filters by section heading", () => {
    const md = [
      "## Arch",
      "```mermaid",
      "graph A",
      "```",
      "## Other",
      "```mermaid",
      "graph B",
      "```",
    ].join("\n");

    const { result } = renderHook(() => useDiagram("Arch"), {
      wrapper: wrapper(md),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].source).toContain("graph A");
  });
});
