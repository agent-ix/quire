/**
 * FR-014: Section Update and Write-back
 *
 * Replace a section's content and return the full updated markdown.
 */
import type { QuireDocument } from "./types";
import { section } from "./query";

/**
 * Update a single section's content and return the full markdown.
 *
 * FR-014-AC-1: Target section replaced with newContent.
 * FR-014-AC-2: All other sections remain byte-identical.
 * FR-014-AC-3: Frontmatter is preserved.
 */
export function updateSection(
  doc: QuireDocument,
  heading: string,
  newContent: string
): string {
  const target = section(doc, heading);
  if (!target) {
    throw new Error(`Section "${heading}" not found in document`);
  }

  const lines = doc.raw.split("\n");

  // The content starts on the line after the heading and ends before the next heading
  const contentStart = target.startLine + 1;
  const contentEnd = target.endLine + 1; // endLine is 0-based, slice is exclusive

  // Find actual line range: startLine is relative to body (after frontmatter)
  // We need to offset by frontmatter lines if present
  let fmOffset = 0;
  if (doc.frontmatter) {
    // Count frontmatter lines in raw
    const fmEnd = doc.raw.indexOf("\n---", 3);
    if (fmEnd !== -1) {
      fmOffset = doc.raw.slice(0, fmEnd + 4).split("\n").length;
    }
  }

  const absStart = fmOffset + contentStart;
  const absEnd = fmOffset + contentEnd;

  // Build the updated document
  const before = lines.slice(0, absStart);
  const after = lines.slice(absEnd);

  const result = [...before, newContent, ...after].join("\n");
  return result;
}
