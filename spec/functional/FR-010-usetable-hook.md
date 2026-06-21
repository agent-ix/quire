---
id: FR-010
title: 'useTable hook'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-003'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-016'
    type: 'implements'
---

# [FR-010] useTable hook

## Description

`useTable(heading)` SHALL return the `TableResult` for the first table in the
named section, or `{ headers: [], rows: [] }` when the section is missing or
contains no table. Result is memoized on `(doc, heading)`.

## Inputs

- `heading: string`

## Outputs

- `TableResult` — `{ headers, rows }`

## Acceptance Criteria

| ID          | Criteria                                         | Verification                      |
| ----------- | ------------------------------------------------ | --------------------------------- |
| FR-010-AC-1 | Returns the table from the named section         | Test (tests/react/hooks.test.tsx) |
| FR-010-AC-2 | Returns empty headers/rows for a missing section | Test (tests/react/hooks.test.tsx) |

## Dependencies

- **Upstream**: [US-003](../usecase/US-003-extract-tables-from-sections.md), [US-016](../usecase/US-016-parse-requirement-summary-tables.md)
- **Calls**: [FR-003](./FR-003-table-extraction.md)
