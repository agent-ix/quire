/**
 * FR-002: Section Query by Heading
 * FR-003: Table Extraction
 * FR-004: Structured List Extraction
 * FR-006: Diagram Extraction and Classification
 * FR-007: Full-text Search Across Sections
 * FR-019: Delegation Annotation Parsing
 * FR-020: Diagram Classification
 */
import type {
  QuireDocument,
  QuireSection,
  TableResult,
  ListItem,
  DiagramBlock,
  DelegatedItem,
  ListPattern,
} from './types';

// ─── Section Matching (FR-002) ─────────────────────────────────────────

/**
 * Strip leading section numbers from a heading.
 * Matches: "2.1 In Scope", "1. Purpose", "3.2.1 Details"
 */
const SECTION_NUMBER_RE = /^\d+(\.\d+)*\.?\s*/;

function normalizeHeading(heading: string): string {
  return heading.replace(SECTION_NUMBER_RE, '').trim();
}

/**
 * Find a section by heading text.
 *
 * FR-002 matching algorithm:
 * 1. Strip leading section numbers (digits, dots, spaces) from heading.
 * 2. Case-insensitive exact match against query.
 */
function matchesHeading(section: QuireSection, query: string): boolean {
  const normalizedSection = normalizeHeading(section.heading).toLowerCase();
  const normalizedQuery = normalizeHeading(query).toLowerCase();
  return normalizedSection === normalizedQuery;
}

/** Recursively search all sections (depth-first). */
function findSection(sections: QuireSection[], query: string): QuireSection | null {
  for (const s of sections) {
    if (matchesHeading(s, query)) return s;
    const found = findSection(s.children, query);
    if (found) return found;
  }
  return null;
}

/** Recursively collect all sections matching a filter. */
function collectSections(
  sections: QuireSection[],
  filter?: (s: QuireSection) => boolean
): QuireSection[] {
  const result: QuireSection[] = [];
  for (const s of sections) {
    if (!filter || filter(s)) result.push(s);
    result.push(...collectSections(s.children, filter));
  }
  return result;
}

/**
 * Find a single section by heading (FR-002).
 * Returns null if not found.
 */
export function section(doc: QuireDocument, heading: string): QuireSection | null {
  return findSection(doc.sections, heading);
}

/**
 * Get all sections, optionally filtered by level (FR-002-AC-4).
 */
export function sections(doc: QuireDocument, opts?: { level?: number }): QuireSection[] {
  if (opts?.level != null) {
    return collectSections(doc.sections, (s) => s.level === opts.level);
  }
  return collectSections(doc.sections);
}

// ─── Table Extraction (FR-003) ──────────────────────────────────────────

/** Check if a line is a table separator row. */
function isSeparatorRow(line: string): boolean {
  return /^\|?\s*[-:]+(\s*\|\s*[-:]+)*\s*\|?\s*$/.test(line);
}

/** Parse cells from a table row. */
function parseCells(line: string, headerCount?: number): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);

  const cells = trimmed.split('|').map((c) => c.trim());

  // FR-003-AC-7: Normalize column count
  if (headerCount != null) {
    while (cells.length < headerCount) {
      cells.push('');
    }
    if (cells.length > headerCount) {
      cells.length = headerCount;
    }
  }

  return cells;
}

/**
 * Parse the first markdown table from content (FR-003).
 * Returns empty result if no table found.
 */
export function parseTable(content: string): TableResult {
  if (content == null) {
    throw new TypeError(`parseTable() expects a string, received ${typeof content}`);
  }

  const lines = content.split('\n');
  let headerLine = -1;

  // Find the header row (followed by separator)
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && isSeparatorRow(lines[i + 1])) {
      headerLine = i;
      break;
    }
  }

  if (headerLine === -1) {
    return { headers: [], rows: [] };
  }

  const headers = parseCells(lines[headerLine]);
  const rows: string[][] = [];

  // Collect data rows after the separator
  for (let i = headerLine + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0 || !line.includes('|')) break;
    rows.push(parseCells(line, headers.length));
  }

  return { headers, rows };
}

/**
 * Parse ALL tables from content (FR-003-AC-6).
 */
export function parseTables(content: string): TableResult[] {
  if (content == null) {
    throw new TypeError(`parseTables() expects a string, received ${typeof content}`);
  }

  const lines = content.split('\n');
  const results: TableResult[] = [];
  let i = 0;

  while (i < lines.length - 1) {
    if (lines[i].includes('|') && isSeparatorRow(lines[i + 1])) {
      const headers = parseCells(lines[i]);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length) {
        const line = lines[j].trim();
        if (line.length === 0 || !line.includes('|')) break;
        rows.push(parseCells(line, headers.length));
        j++;
      }
      results.push({ headers, rows });
      i = j;
    } else {
      i++;
    }
  }

  return results;
}

/**
 * Parse the first table from a named section (convenience).
 */
export function tableFromSection(doc: QuireDocument, heading: string): TableResult {
  const s = section(doc, heading);
  if (!s) return { headers: [], rows: [] };
  return parseTable(s.content);
}

// ─── List Extraction (FR-004) ───────────────────────────────────────────

/** Regex patterns for structured list items. */
const BOLD_DASH_RE = /^\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/;
const BOLD_COLON_RE = /^\*\*(.+?)\*\*:\s*(.+)$/;
const BULLET_RE = /^[-*]\s+(.+)$/;

/**
 * Parse bullet list items from content (FR-004).
 */
export function parseBulletList(content: string, opts?: { pattern?: ListPattern }): ListItem[] {
  if (content == null) {
    throw new TypeError(`parseBulletList() expects a string, received ${typeof content}`);
  }

  const pattern = opts?.pattern ?? 'bold-description';
  const lines = content.split('\n');
  const items: ListItem[] = [];

  for (const line of lines) {
    const bulletMatch = BULLET_RE.exec(line.trim());
    if (!bulletMatch) continue;

    const rawText = bulletMatch[1];

    if (pattern === 'bold-description') {
      const match = BOLD_DASH_RE.exec(rawText);
      if (match) {
        items.push({ raw: rawText, title: match[1], description: match[2] });
        continue;
      }
    }

    if (pattern === 'bold-colon') {
      const match = BOLD_COLON_RE.exec(rawText);
      if (match) {
        items.push({ raw: rawText, title: match[1], description: match[2] });
        continue;
      }
    }

    // Fallback: try both patterns before falling to plain
    if (pattern !== 'plain') {
      const dashMatch = BOLD_DASH_RE.exec(rawText);
      if (dashMatch) {
        items.push({
          raw: rawText,
          title: dashMatch[1],
          description: dashMatch[2],
        });
        continue;
      }
      const colonMatch = BOLD_COLON_RE.exec(rawText);
      if (colonMatch) {
        items.push({
          raw: rawText,
          title: colonMatch[1],
          description: colonMatch[2],
        });
        continue;
      }
    }

    items.push({ raw: rawText, title: rawText, description: '' });
  }

  return items;
}

// ─── Diagram Extraction (FR-006) ────────────────────────────────────────

/** Matches an explicit %% @type: logical|deployment annotation in mermaid source. */
const EXPLICIT_TYPE_RE = /^%%\s*@type:\s*(logical|deployment)/im;

/**
 * Extract diagrams from a parsed document (FR-006).
 * Optionally classify as logical/deployment (FR-020).
 */
export function extractDiagrams(
  doc: QuireDocument,
  opts?: { language?: string; classify?: boolean }
): DiagramBlock[] {
  const blocks: DiagramBlock[] = [];
  const body = doc.frontmatter ? doc.raw.slice(doc.raw.indexOf('\n---', 3) + 4) : doc.raw;
  const lines = body.split('\n');
  let currentSection: string | null = null;
  let inBlock = false;
  let blockLang = '';
  let blockLines: string[] = [];
  let blockIndex = 0;

  for (const line of lines) {
    // Track current section
    const headingMatch = /^#{1,6}\s+(.+)$/.exec(line);
    if (headingMatch && !inBlock) {
      currentSection = headingMatch[1].trim();
      continue;
    }

    const fenceMatch = /^```(\w*)/.exec(line.trimStart());
    if (fenceMatch && !inBlock) {
      inBlock = true;
      blockLang = fenceMatch[1] || '';
      blockLines = [];
      continue;
    }

    if (inBlock && line.trimStart().startsWith('```')) {
      // End of fenced block
      const lang = blockLang;
      if (!opts?.language || lang === opts.language) {
        blocks.push({
          index: blockIndex++,
          language: lang,
          source: blockLines.join('\n'),
          section: currentSection,
          classification: null,
        });
      }
      inBlock = false;
      blockLang = '';
      blockLines = [];
      continue;
    }

    if (inBlock) {
      blockLines.push(line);
    }
  }

  // FR-027-AC-3: Unclosed fenced block — treat remainder as content
  if (inBlock && blockLines.length > 0) {
    const lang = blockLang;
    if (!opts?.language || lang === opts.language) {
      blocks.push({
        index: blockIndex++,
        language: lang,
        source: blockLines.join('\n'),
        section: currentSection,
        classification: null,
      });
    }
  }

  // FR-020: Classification
  if (opts?.classify) {
    classifyDiagrams(blocks);
  }

  return blocks;
}

/**
 * Classify diagrams in-place as "logical" or "deployment" (FR-020).
 *
 * Classification rules (in order):
 * 1. Explicit `%% @type: logical` or `%% @type: deployment` annotation — takes precedence.
 * 2. First unannotated block defaults to "logical".
 */
export function classifyDiagrams(blocks: DiagramBlock[]): void {
  let hasLogical = false;

  // Pass 1: honour explicit %% @type: annotations
  for (const block of blocks) {
    const match = EXPLICIT_TYPE_RE.exec(block.source);
    if (match) {
      block.classification = match[1];
    }
  }

  // Pass 2: first unannotated block defaults to "logical"
  for (const block of blocks) {
    if (block.classification === null) {
      block.classification = 'logical';
      hasLogical = true;
      break;
    }
  }

  // FR-020-AC-2: single diagram with only a deployment annotation — leave as-is;
  // consumers (ApplicationDetailPage) already handle the single-diagram case.
  if (blocks.length === 1 && !hasLogical && blocks[0].classification === null) {
    blocks[0].classification = 'logical';
  }
}

// ─── Delegation Parsing (FR-019) ────────────────────────────────────────

const DELEGATION_RE = /\((?:handled by|delegated to)\s+(.+?)\)/i;

/**
 * Parse delegation annotations from bullet list content (FR-019).
 */
export function parseDelegations(content: string): DelegatedItem[] {
  if (content == null) {
    throw new TypeError(`parseDelegations() expects a string, received ${typeof content}`);
  }

  const lines = content.split('\n');
  const items: DelegatedItem[] = [];

  for (const line of lines) {
    const bulletMatch = BULLET_RE.exec(line.trim());
    if (!bulletMatch) continue;

    const rawText = bulletMatch[1];
    const delegationMatch = DELEGATION_RE.exec(rawText);

    if (delegationMatch) {
      const item = rawText.replace(DELEGATION_RE, '').trim();
      items.push({ item, delegation: delegationMatch[1] });
    } else {
      items.push({ item: rawText, delegation: undefined });
    }
  }

  return items;
}

// ─── Full-text Search (FR-007) ──────────────────────────────────────────

export interface SearchResult {
  section: QuireSection;
  matches: { line: number; text: string }[];
}

/**
 * Search all sections for a query string (FR-007).
 * Case-insensitive.
 */
export function search(doc: QuireDocument, query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  const allSections = collectSections(doc.sections);

  for (const s of allSections) {
    const sectionLines = s.content.split('\n');
    const matches: { line: number; text: string }[] = [];

    for (let i = 0; i < sectionLines.length; i++) {
      if (sectionLines[i].toLowerCase().includes(lowerQuery)) {
        matches.push({ line: s.startLine + 1 + i, text: sectionLines[i] });
      }
    }

    if (matches.length > 0) {
      results.push({ section: s, matches });
    }
  }

  return results;
}
