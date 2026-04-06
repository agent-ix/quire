import { describe, it, expect } from 'vitest';
import { parseDocument } from '../../src/core/parser';
import {
  section,
  sections,
  parseTable,
  parseTables,
  tableFromSection,
  parseBulletList,
  extractDiagrams,
  findDiagramByTag,
  parseDelegations,
  search,
} from '../../src/core/query';

// ─── Section Query (FR-002) ─────────────────────────────────────────────

describe('section() (FR-002)', () => {
  const md = [
    '## Purpose',
    'purpose content',
    '## 2.1 In Scope',
    'scope content',
    '## notes',
    'notes content',
  ].join('\n');

  const doc = parseDocument(md);

  it('FR-002-AC-1: matches by heading text', () => {
    const s = section(doc, 'Purpose');
    expect(s).not.toBeNull();
    expect(s!.content).toBe('purpose content');
  });

  it('FR-002-AC-1: matches numbered headings stripped of number', () => {
    const s = section(doc, 'In Scope');
    expect(s).not.toBeNull();
    expect(s!.content).toBe('scope content');
  });

  it('FR-002-AC-2: case-insensitive match', () => {
    const s = section(doc, 'in scope');
    expect(s).not.toBeNull();
  });

  it('FR-002-AC-3: returns null for non-existent heading', () => {
    const s = section(doc, 'NonExistent');
    expect(s).toBeNull();
  });

  it("FR-002-AC-5: exact match after number stripping — 'Scope' does not match '2.1 In Scope'", () => {
    const s = section(doc, 'Scope');
    expect(s).toBeNull();
  });
});

describe('sections() (FR-002-AC-4)', () => {
  const md = '# H1\nh1\n## H2a\nh2a\n### H3\nh3\n## H2b\nh2b';
  const doc = parseDocument(md);

  it('returns only sections at specified level', () => {
    const level2 = sections(doc, { level: 2 });
    expect(level2).toHaveLength(2);
    expect(level2[0].heading).toBe('H2a');
    expect(level2[1].heading).toBe('H2b');
  });

  it('returns all sections when no filter', () => {
    const all = sections(doc);
    expect(all.length).toBeGreaterThanOrEqual(4);
  });
});

// ─── Table Extraction (FR-003) ──────────────────────────────────────────

describe('parseTable (FR-003)', () => {
  it('FR-003-AC-1: extracts headers and rows', () => {
    const content = '| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |';
    const result = parseTable(content);

    expect(result.headers).toEqual(['A', 'B']);
    expect(result.rows).toEqual([
      ['1', '2'],
      ['3', '4'],
    ]);
  });

  it('FR-003-AC-2: excludes separator rows', () => {
    const content = '| H |\n|---|\n| d |';
    const result = parseTable(content);
    expect(result.rows).toHaveLength(1);
  });

  it('FR-003-AC-3: strips leading/trailing pipes', () => {
    const content = '| A |\n|---|\n| val |';
    const result = parseTable(content);
    expect(result.headers).toEqual(['A']);
    expect(result.rows[0]).toEqual(['val']);
  });

  it('FR-003-AC-4: trims cell whitespace', () => {
    const content = '|  A  |  B  |\n|---|---|\n|  1  |  2  |';
    const result = parseTable(content);
    expect(result.rows[0]).toEqual(['1', '2']);
  });

  it('FR-003-AC-5: no table returns empty', () => {
    const result = parseTable('just some text\nno table here');
    expect(result.headers).toEqual([]);
    expect(result.rows).toEqual([]);
  });

  it('FR-003-AC-7: pads short rows and truncates long rows', () => {
    const content = '| A | B | C |\n|---|---|---|\n| 1 |\n| 1 | 2 | 3 | 4 |';
    const result = parseTable(content);

    // Short row padded
    expect(result.rows[0]).toEqual(['1', '', '']);
    // Long row truncated
    expect(result.rows[1]).toEqual(['1', '2', '3']);
  });
});

describe('parseTables (FR-003-AC-6)', () => {
  it('returns all tables from content', () => {
    const content = [
      '| A | B |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      'Some text',
      '',
      '| X | Y |',
      '|---|---|',
      '| 3 | 4 |',
    ].join('\n');

    const results = parseTables(content);
    expect(results).toHaveLength(2);
    expect(results[0].headers).toEqual(['A', 'B']);
    expect(results[1].headers).toEqual(['X', 'Y']);
  });
});

describe('tableFromSection', () => {
  it('extracts table from named section', () => {
    const md = '## API\n| Method | Path |\n|---|---|\n| GET | /api |';
    const doc = parseDocument(md);
    const result = tableFromSection(doc, 'API');

    expect(result.headers).toEqual(['Method', 'Path']);
    expect(result.rows[0]).toEqual(['GET', '/api']);
  });

  it('returns empty for non-existent section', () => {
    const doc = parseDocument('## Other\ncontent');
    const result = tableFromSection(doc, 'Missing');
    expect(result.headers).toEqual([]);
  });
});

// ─── List Extraction (FR-004) ───────────────────────────────────────────

describe('parseBulletList (FR-004)', () => {
  it('FR-004-AC-1: bold-description pattern', () => {
    const content = '- **Auth** — Token-based authentication\n- **Cache** — Redis-backed caching';
    const items = parseBulletList(content);

    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('Auth');
    expect(items[0].description).toBe('Token-based authentication');
  });

  it('FR-004-AC-2: bold-colon pattern', () => {
    const content = '- **Auth**: Token-based';
    const items = parseBulletList(content, { pattern: 'bold-colon' });

    expect(items[0].title).toBe('Auth');
    expect(items[0].description).toBe('Token-based');
  });

  it('FR-004-AC-3: plain items have full text as title', () => {
    const content = '- Simple item\n- Another item';
    const items = parseBulletList(content, { pattern: 'plain' });

    expect(items[0].title).toBe('Simple item');
    expect(items[0].description).toBe('');
  });

  it('FR-004-AC-4: excludes non-bullet lines', () => {
    const content = 'Normal text\n- Bullet\nMore text';
    const items = parseBulletList(content);
    expect(items).toHaveLength(1);
  });

  it('handles * bullets', () => {
    const content = '* Item one\n* Item two';
    const items = parseBulletList(content, { pattern: 'plain' });
    expect(items).toHaveLength(2);
  });
});

// ─── Diagram Extraction (FR-006) ────────────────────────────────────────

describe('extractDiagrams (FR-006)', () => {
  it('FR-006-AC-1: extracts mermaid blocks', () => {
    const md = '## Arch\n```mermaid\ngraph TD\n  A --> B\n```';
    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(diagrams).toHaveLength(1);
    expect(diagrams[0].language).toBe('mermaid');
    expect(diagrams[0].source).toContain('A --> B');
  });

  it('FR-006-AC-2: parses %% @type: annotation into tag field', () => {
    const md = [
      '## Arch',
      '```mermaid',
      '%% @type: logical',
      'graph TD',
      '  A --> B',
      '```',
      '```mermaid',
      '%% @type: deployment',
      'graph TD',
      '  A --> B',
      '```',
    ].join('\n');

    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(diagrams[0].tag).toBe('logical');
    expect(diagrams[1].tag).toBe('deployment');
  });

  it('FR-006-AC-3: tag is null when no annotation present', () => {
    const md = '## A\n```mermaid\ngraph TD\n  A --> B\n```';
    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(diagrams[0].tag).toBeNull();
  });

  it('FR-006-AC-4: tracks section association', () => {
    const md = '## Architecture\n```mermaid\ngraph TD\n  A\n```';
    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(diagrams[0].section).toBe('Architecture');
  });

  it('filters by language', () => {
    const md = '```mermaid\nA\n```\n```plantuml\nB\n```';
    const doc = parseDocument(md);
    const mermaid = extractDiagrams(doc, { language: 'mermaid' });

    expect(mermaid).toHaveLength(1);
    expect(mermaid[0].language).toBe('mermaid');
  });

  it('assigns index to diagrams', () => {
    const md = '```mermaid\nA\n```\n```mermaid\nB\n```';
    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(diagrams[0].index).toBe(0);
    expect(diagrams[1].index).toBe(1);
  });
});

// ─── findDiagramByTag (FR-006) ───────────────────────────────────────────────

describe('findDiagramByTag (FR-006)', () => {
  it('returns the first block matching the given tag', () => {
    const md = [
      '```mermaid',
      '%% @type: logical',
      'graph TD\n  A --> B',
      '```',
      '```mermaid',
      '%% @type: deployment',
      'graph TD\n  C --> D',
      '```',
    ].join('\n');
    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(findDiagramByTag(diagrams, 'logical')!.tag).toBe('logical');
    expect(findDiagramByTag(diagrams, 'deployment')!.tag).toBe('deployment');
  });

  it('returns null when no block has the given tag', () => {
    const md = '```mermaid\ngraph TD\n```';
    const doc = parseDocument(md);
    const diagrams = extractDiagrams(doc);

    expect(findDiagramByTag(diagrams, 'deployment')).toBeNull();
  });
});

// ─── Delegation Parsing (FR-019) ────────────────────────────────────────

describe('parseDelegations (FR-019)', () => {
  it("FR-019-AC-1: extracts 'handled by' annotations", () => {
    const content = '- Auth tokens (handled by auth-service)';
    const items = parseDelegations(content);

    expect(items[0].item).toBe('Auth tokens');
    expect(items[0].delegation).toBe('auth-service');
  });

  it("FR-019-AC-2: extracts 'delegated to' annotations", () => {
    const content = '- Auth tokens (delegated to auth-service)';
    const items = parseDelegations(content);

    expect(items[0].delegation).toBe('auth-service');
  });

  it('FR-019-AC-3: no annotation → undefined delegation', () => {
    const content = '- Simple item';
    const items = parseDelegations(content);

    expect(items[0].item).toBe('Simple item');
    expect(items[0].delegation).toBeUndefined();
  });
});

// ─── Search (FR-007) ────────────────────────────────────────────────────

describe('search (FR-007)', () => {
  const md = '## Auth\ntoken authentication here\n## Cache\nredis caching layer';
  const doc = parseDocument(md);

  it('FR-007-AC-1: finds sections containing query', () => {
    const results = search(doc, 'authentication');
    expect(results).toHaveLength(1);
    expect(results[0].section.heading).toBe('Auth');
  });

  it('FR-007-AC-2: case-insensitive', () => {
    const results = search(doc, 'AUTHENTICATION');
    expect(results).toHaveLength(1);
  });

  it('FR-007-AC-3: includes line numbers', () => {
    const results = search(doc, 'token');
    expect(results[0].matches[0]).toHaveProperty('line');
    expect(results[0].matches[0]).toHaveProperty('text');
  });
});
