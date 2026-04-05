import { describe, it, expect } from "vitest";
import { extractFrontmatter } from "../../src/core/frontmatter";

describe("extractFrontmatter (FR-005)", () => {
  it("FR-005-AC-1: extracts YAML frontmatter", () => {
    const md = "---\nfoo: bar\n---\nbody content";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toEqual({ foo: "bar" });
    expect(result.body).toBe("body content");
  });

  it("FR-005-AC-2: no frontmatter markers → null", () => {
    const md = "just body content";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toBeNull();
    expect(result.body).toBe("just body content");
  });

  it("FR-005-AC-3: parses array values", () => {
    const md = "---\nstandards_alignment: [iso-29148, ieee-828]\n---\nbody";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toEqual({
      standards_alignment: ["iso-29148", "ieee-828"],
    });
  });

  it("FR-005-AC-4: parses related_standards array", () => {
    const md = "---\nrelated_standards: [cloudevents]\n---\nbody";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toEqual({
      related_standards: ["cloudevents"],
    });
  });

  it("parses boolean values", () => {
    const md = "---\nenabled: true\ndisabled: false\n---\nbody";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toEqual({ enabled: true, disabled: false });
  });

  it("parses numeric values", () => {
    const md = "---\ncount: 42\n---\nbody";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toEqual({ count: 42 });
  });

  it("parses quoted strings", () => {
    const md = '---\nname: "hello world"\n---\nbody';
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toEqual({ name: "hello world" });
  });
});

describe("extractFrontmatter edge cases (FR-027)", () => {
  it("FR-027-AC-2: malformed YAML returns null frontmatter", () => {
    const md = "---\n{invalid yaml!!!\n---\nbody";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toBeNull();
    expect(result.body).toBe(md);
  });

  it("FR-027-AC-5: null input throws TypeError", () => {
    expect(() =>
      extractFrontmatter(null as unknown as string)
    ).toThrow(TypeError);
  });

  it("handles no closing --- marker", () => {
    const md = "---\nfoo: bar\nno closing marker";
    const result = extractFrontmatter(md);

    expect(result.frontmatter).toBeNull();
    expect(result.body).toBe(md);
  });

  it("handles empty frontmatter", () => {
    const md = "---\n---\nbody";
    const result = extractFrontmatter(md);

    // Empty YAML block → null
    expect(result.frontmatter).toBeNull();
  });
});
