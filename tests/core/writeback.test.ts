import { describe, it, expect } from 'vitest';
import { parseDocument } from '../../src/core/parser';
import { updateSection } from '../../src/core/writeback';

describe('updateSection (FR-014)', () => {
  it('FR-014-AC-1: replaces target section content', () => {
    const md = '## Purpose\nold content\n## Scope\nscope content';
    const doc = parseDocument(md);
    const updated = updateSection(doc, 'Purpose', 'new content');

    expect(updated).toContain('new content');
    expect(updated).not.toContain('old content');
  });

  it('FR-014-AC-2: preserves other sections', () => {
    const md = '## Purpose\nold content\n## Scope\nscope content';
    const doc = parseDocument(md);
    const updated = updateSection(doc, 'Purpose', 'new content');

    expect(updated).toContain('## Scope');
    expect(updated).toContain('scope content');
  });

  it('FR-014-AC-3: preserves frontmatter', () => {
    const md = '---\nfoo: bar\n---\n## Purpose\nold\n## Scope\nscope';
    const doc = parseDocument(md);
    const updated = updateSection(doc, 'Purpose', 'new');

    expect(updated).toContain('---');
    expect(updated).toContain('foo: bar');
  });

  it('throws for non-existent section', () => {
    const md = '## Purpose\ncontent';
    const doc = parseDocument(md);

    expect(() => updateSection(doc, 'Missing', 'x')).toThrow('Section "Missing" not found');
  });
});
