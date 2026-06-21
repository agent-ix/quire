---
id: FR-001
title: 'Parse document into section tree'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-001'
    type: 'implements'
---

# [FR-001] Parse document into section tree

## Description

The `parseDocument(markdown)` function SHALL accept a raw markdown string and
return a `QuireDocument` containing `preamble`, a hierarchical tree of
`sections`, the parsed `frontmatter`, and the original `raw` markdown. Headings
`#`–`######` (levels 1–6) become sections; nested headings nest under their
parent by level. Content before the first heading is captured as `preamble`.
Headings inside fenced code blocks are NOT treated as section headings.

Each `QuireSection` carries a stable `id` (slug of heading + `L<startLine>`),
`heading` (raw text, section numbers preserved), `level`, trimmed `content`,
`children`, and 0-based `startLine`/`endLine`.

## Inputs

- `markdown: string` — raw document text

## Outputs

- `QuireDocument` — `{ preamble, sections, raw, frontmatter }`

## Acceptance Criteria

| ID          | Criteria                                                                       | Verification                     |
| ----------- | ------------------------------------------------------------------------------ | -------------------------------- |
| FR-001-AC-1 | `## A ... ## B` yields two top-level sections "A" and "B"                      | Test (tests/core/parser.test.ts) |
| FR-001-AC-2 | `## A ... ### A.1` nests "A.1" under "A"                                       | Test (tests/core/parser.test.ts) |
| FR-001-AC-3 | Content before the first heading becomes `preamble`                            | Test (tests/core/parser.test.ts) |
| FR-001-AC-4 | Numbered heading `## 2.1 In Scope` preserves full heading text                 | Test (tests/core/parser.test.ts) |
| FR-001-AC-5 | Headings inside ` ``` ` fenced blocks are not parsed as sections               | Test (tests/core/parser.test.ts) |
| FR-001-AC-6 | A document with no headings captures everything as `preamble`, `sections` `[]` | Test (tests/core/parser.test.ts) |

## Dependencies

- **Upstream**: [US-001](../usecase/US-001-parse-a-spec-into-sections.md)
- **Calls**: [FR-005](./FR-005-frontmatter-extraction.md) to strip frontmatter before sectioning
- **Performance**: [NFR-001](../non-functional/NFR-001-parse-performance.md)
