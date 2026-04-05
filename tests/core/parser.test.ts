import { describe, it, expect } from "vitest";
import { parseDocument } from "../../src/core/parser";

describe("parseDocument (FR-001)", () => {
  it("FR-001-AC-1: splits by ## headings into named sections", () => {
    const md = "## Purpose\nThis is the purpose\n## Scope\nThis is the scope";
    const doc = parseDocument(md);

    expect(doc.sections).toHaveLength(2);
    expect(doc.sections[0].heading).toBe("Purpose");
    expect(doc.sections[0].content).toBe("This is the purpose");
    expect(doc.sections[1].heading).toBe("Scope");
    expect(doc.sections[1].content).toBe("This is the scope");
  });

  it("FR-001-AC-2: nested headings form a hierarchy", () => {
    const md = "## Parent\nparent content\n### Child\nchild content";
    const doc = parseDocument(md);

    expect(doc.sections).toHaveLength(1);
    expect(doc.sections[0].heading).toBe("Parent");
    expect(doc.sections[0].children).toHaveLength(1);
    expect(doc.sections[0].children[0].heading).toBe("Child");
    expect(doc.sections[0].children[0].content).toBe("child content");
  });

  it("FR-001-AC-3: captures preamble before first heading", () => {
    const md = "This is preamble\n\n## First Section\ncontent";
    const doc = parseDocument(md);

    expect(doc.preamble).toBe("This is preamble");
    expect(doc.sections).toHaveLength(1);
    expect(doc.sections[0].heading).toBe("First Section");
  });

  it("FR-001-AC-4: preserves numbered headings", () => {
    const md = "## 2.1 In Scope\ncontent";
    const doc = parseDocument(md);

    expect(doc.sections[0].heading).toBe("2.1 In Scope");
  });

  it("generates stable section ids", () => {
    const md = "## Purpose\ncontent";
    const doc = parseDocument(md);

    expect(doc.sections[0].id).toMatch(/^purpose-L\d+$/);
  });

  it("handles multi-level nesting (##, ###, ####)", () => {
    const md = [
      "## L2",
      "l2 content",
      "### L3",
      "l3 content",
      "#### L4",
      "l4 content",
      "### L3b",
      "l3b content",
    ].join("\n");

    const doc = parseDocument(md);
    expect(doc.sections).toHaveLength(1);
    expect(doc.sections[0].children).toHaveLength(2); // L3, L3b
    expect(doc.sections[0].children[0].children).toHaveLength(1); // L4
  });

  it("does not parse headings inside fenced code blocks", () => {
    const md = "## Real\ncontent\n```\n## Not a heading\n```\n## Also Real\nmore";
    const doc = parseDocument(md);

    expect(doc.sections).toHaveLength(2);
    expect(doc.sections[0].heading).toBe("Real");
    expect(doc.sections[1].heading).toBe("Also Real");
  });

  it("preserves raw markdown", () => {
    const md = "## A\ncontent";
    const doc = parseDocument(md);
    expect(doc.raw).toBe(md);
  });

  it("handles document with no headings", () => {
    const md = "Just some text\nwith no headings";
    const doc = parseDocument(md);

    expect(doc.sections).toHaveLength(0);
    expect(doc.preamble).toBe("Just some text\nwith no headings");
  });
});

describe("parseDocument edge cases (FR-027)", () => {
  it("FR-027-AC-1: empty string returns empty document", () => {
    const doc = parseDocument("");
    expect(doc.preamble).toBeNull();
    expect(doc.sections).toHaveLength(0);
    expect(doc.raw).toBe("");
  });

  it("FR-027-AC-4: heading with empty content has empty string", () => {
    const md = "## Empty\n## Next\ncontent";
    const doc = parseDocument(md);

    expect(doc.sections).toHaveLength(2);
    expect(doc.sections[0].content).toBe("");
    expect(doc.sections[1].content).toBe("content");
  });

  it("FR-027-AC-5: null input throws TypeError", () => {
    expect(() => parseDocument(null as unknown as string)).toThrow(TypeError);
    expect(() => parseDocument(undefined as unknown as string)).toThrow(
      TypeError
    );
  });

  it("FR-027-AC-3: unclosed fenced block is handled", () => {
    const md = "## Section\n```mermaid\ngraph TD\n  A --> B";
    const doc = parseDocument(md);

    // Should not crash — section is parsed
    expect(doc.sections).toHaveLength(1);
  });
});
