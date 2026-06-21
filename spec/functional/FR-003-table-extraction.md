---
id: FR-003
title: 'Table extraction'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-003'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-011'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-016'
    type: 'implements'
---

# [FR-003] Table extraction

## Description

`parseTable(content)` SHALL extract the FIRST markdown table (a row containing
`|` followed by a separator row) and return `{ headers, rows }`. Separator rows
are excluded; leading/trailing pipes are stripped; cells are trimmed. Rows are
normalized to header column count — short rows padded with empty strings, long
rows truncated. `parseTables(content)` SHALL return ALL tables.
`tableFromSection(doc, heading)` SHALL locate the section then parse its first
table, returning empty results for a missing section. All three throw
`TypeError` on `null`/`undefined` input.

## Inputs

- `content: string` (parseTable / parseTables) or `doc, heading` (tableFromSection)

## Outputs

- `TableResult` `{ headers: string[], rows: string[][] }` (or `TableResult[]`)

## Acceptance Criteria

| ID          | Criteria                                                    | Verification                    |
| ----------- | ----------------------------------------------------------- | ------------------------------- | --- | --------------- | ------------------------------- |
| FR-003-AC-1 | Extracts `headers` and `rows` from a basic table            | Test (tests/core/query.test.ts) |
| FR-003-AC-2 | Separator rows (`                                           | ---                             | --- | `) are excluded | Test (tests/core/query.test.ts) |
| FR-003-AC-3 | Leading/trailing pipes are stripped                         | Test (tests/core/query.test.ts) |
| FR-003-AC-4 | Cell whitespace is trimmed                                  | Test (tests/core/query.test.ts) |
| FR-003-AC-5 | No table returns `{ headers: [], rows: [] }`                | Test (tests/core/query.test.ts) |
| FR-003-AC-6 | `parseTables()` returns all tables in content               | Test (tests/core/query.test.ts) |
| FR-003-AC-7 | Short rows padded, long rows truncated to header count      | Test (tests/core/query.test.ts) |
| FR-003-AC-8 | `tableFromSection` returns empty for a non-existent section | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-003](../usecase/US-003-extract-tables-from-sections.md), [US-011](../usecase/US-011-render-api-endpoint-tables.md), [US-016](../usecase/US-016-parse-requirement-summary-tables.md)
