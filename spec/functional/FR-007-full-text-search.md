---
id: FR-007
title: 'Full-text search across sections'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-002'
    type: 'implements'
---

# FR-007: Full-text search across sections

## Description

`search(doc, query)` SHALL perform a case-insensitive substring search across
every section's content (full tree) and return `SearchResult[]`, one per matching
section, each with the `section` and a list of `matches` carrying the absolute
`line` number and the matching line `text`. Sections with no match are omitted.

## Inputs

- `doc: QuireDocument`, `query: string`

## Outputs

- `SearchResult[]` — `{ section, matches: { line, text }[] }`

## Acceptance Criteria

| ID          | Criteria                                                     | Verification                    |
| ----------- | ------------------------------------------------------------ | ------------------------------- |
| FR-007-AC-1 | Returns all sections containing the query string             | Test (tests/core/query.test.ts) |
| FR-007-AC-2 | Search is case-insensitive                                   | Test (tests/core/query.test.ts) |
| FR-007-AC-3 | Each match includes a line number and the matching line text | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-002](../usecase/US-002-query-a-specific-section.md)
