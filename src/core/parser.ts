/**
 * FR-001: Parse Document into Section Tree
 * FR-027: Error Handling and Edge Cases
 *
 * Parses a raw markdown string into a QuireDocument with
 * hierarchical sections, frontmatter, and preamble.
 */
import type { QuireDocument, QuireSection } from "./types";
import { extractFrontmatter } from "./frontmatter";

/** Generate a stable section id from heading and line number. */
function sectionId(heading: string, startLine: number): string {
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-L${startLine}`;
}

/** Regex to detect a markdown heading line. */
const HEADING_RE = /^(#{1,6})\s+(.+)$/;

/**
 * Parse a raw markdown string into a QuireDocument.
 *
 * FR-001-AC-1: ## headings become named sections with content.
 * FR-001-AC-2: Nested headings form a hierarchy.
 * FR-001-AC-3: Content before first heading is captured as preamble.
 * FR-027-AC-1: Empty string → { preamble: null, sections: [], raw: '' }
 * FR-027-AC-5: null/undefined → TypeError
 */
export function parseDocument(markdown: string): QuireDocument {
  if (markdown == null) {
    throw new TypeError(
      `parseDocument() expects a string, received ${typeof markdown}`
    );
  }

  // Extract frontmatter first
  const { frontmatter, body } = extractFrontmatter(markdown);

  if (body.length === 0) {
    return {
      preamble: null,
      sections: [],
      raw: markdown,
      frontmatter,
    };
  }

  const lines = body.split("\n");

  // Collect flat list of heading positions + levels
  const headings: { level: number; heading: string; lineIndex: number }[] = [];
  let inFencedBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track fenced code blocks to avoid parsing headings inside them
    if (line.trimStart().startsWith("```")) {
      inFencedBlock = !inFencedBlock;
      continue;
    }
    if (inFencedBlock) continue;

    const match = HEADING_RE.exec(line);
    if (match) {
      headings.push({
        level: match[1].length,
        heading: match[2].trim(),
        lineIndex: i,
      });
    }
  }

  // Extract preamble (content before first heading)
  let preamble: string | null = null;
  if (headings.length > 0 && headings[0].lineIndex > 0) {
    const preambleLines = lines.slice(0, headings[0].lineIndex);
    const preambleText = preambleLines.join("\n").trim();
    preamble = preambleText.length > 0 ? preambleText : null;
  } else if (headings.length === 0) {
    // No headings at all — everything is preamble
    const bodyText = body.trim();
    preamble = bodyText.length > 0 ? bodyText : null;
    return {
      preamble,
      sections: [],
      raw: markdown,
      frontmatter,
    };
  }

  // Build flat sections with content between headings
  const flatSections: QuireSection[] = headings.map((h, idx) => {
    const nextHeadingLine =
      idx < headings.length - 1 ? headings[idx + 1].lineIndex : lines.length;
    const contentLines = lines.slice(h.lineIndex + 1, nextHeadingLine);
    const content = contentLines.join("\n").trim();

    return {
      id: sectionId(h.heading, h.lineIndex),
      heading: h.heading,
      level: h.level,
      content,
      children: [],
      startLine: h.lineIndex,
      endLine: nextHeadingLine - 1,
    };
  });

  // Build hierarchy: nest sections under their parent based on level
  const topLevel: QuireSection[] = [];
  const stack: QuireSection[] = [];

  for (const section of flatSections) {
    // Pop stack until we find a parent with lower level
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      topLevel.push(section);
    } else {
      stack[stack.length - 1].children.push(section);
    }
    stack.push(section);
  }

  return {
    preamble,
    sections: topLevel,
    raw: markdown,
    frontmatter,
  };
}
