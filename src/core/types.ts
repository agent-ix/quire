/**
 * Core types for Quire document model.
 * Layer 1+2: Pure TypeScript, zero React dependency.
 */

/** A single section in the document tree. */
export interface QuireSection {
  /** Stable identifier (slug of heading + startLine). */
  id: string;
  /** Raw heading text (without # prefix). */
  heading: string;
  /** Heading level 1-6. */
  level: number;
  /** Raw markdown content between this heading and the next. */
  content: string;
  /** Nested sub-sections. */
  children: QuireSection[];
  /** Line number of the heading in the source document (0-based). */
  startLine: number;
  /** Line number of the last content line (0-based). */
  endLine: number;
}

/** Parsed document with section tree. */
export interface QuireDocument {
  /** Content before the first heading, or null if none. */
  preamble: string | null;
  /** Top-level sections. */
  sections: QuireSection[];
  /** Original raw markdown. */
  raw: string;
  /** Parsed frontmatter, or null if none. */
  frontmatter: Record<string, unknown> | null;
}

/** Result of frontmatter extraction. */
export interface FrontmatterResult<T = Record<string, unknown>> {
  /** Parsed frontmatter object, or null on missing/malformed YAML. */
  frontmatter: T | null;
  /** Body content after frontmatter. */
  body: string;
}

/** Result of table parsing. */
export interface TableResult {
  /** Column headers. */
  headers: string[];
  /** Data rows (each row is an array of cell strings). */
  rows: string[][];
}

/** A parsed bullet list item. */
export interface ListItem {
  /** Full bullet text. */
  raw: string;
  /** Bold portion or full text. */
  title: string;
  /** Text after separator or empty. */
  description: string;
}

/** A fenced code block extracted from the document. */
export interface DiagramBlock {
  /** Position in document (0-based). */
  index: number;
  /** Language identifier (e.g. "mermaid"). */
  language: string;
  /** Raw diagram source. */
  source: string;
  /** Heading of containing section, or null if in preamble. */
  section: string | null;
  /** Value of the %% @type: annotation in the source, or null if absent. */
  tag: string | null;
}

/** A bullet list item with delegation annotation. */
export interface DelegatedItem {
  /** Text without the delegation annotation. */
  item: string;
  /** Target component name, or undefined if no delegation. */
  delegation: string | undefined;
}

/** Pattern for structured list parsing. */
export type ListPattern = 'bold-description' | 'bold-colon' | 'plain';
