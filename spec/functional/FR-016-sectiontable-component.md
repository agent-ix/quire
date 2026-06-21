---
id: FR-016
title: 'SectionTable component'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-008'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-011'
    type: 'implements'
---

# [FR-016] SectionTable component

## Description

`<SectionTable heading columns? cellRenderers? onRowClick? className?>` SHALL
parse the named section's first table and render it as an HTML `<table>`. Columns
default to the parsed headers; `cellRenderers` keyed by column name supply
per-cell React. Rows are clickable when `onRowClick` is provided. A section with
no table renders `null`. Method-to-color badge styling and backtick stripping are
the consumer's responsibility inside `cellRenderers` (see review BSF-2).

## Inputs

- `heading`, `columns?`, `cellRenderers?`, `onRowClick?`, `className?`

## Outputs

- A themed `<table>`, or `null`

## Acceptance Criteria

| ID          | Criteria                                          | Verification                           |
| ----------- | ------------------------------------------------- | -------------------------------------- |
| FR-016-AC-1 | Renders the parsed table from the named section   | Test (tests/react/components.test.tsx) |
| FR-016-AC-2 | A section with no table renders `null`            | Test (tests/react/components.test.tsx) |
| FR-016-AC-3 | `cellRenderers` apply per-column custom rendering | Test (tests/react/components.test.tsx) |
| FR-016-AC-4 | A throwing cell renderer falls back to raw text   | Test (tests/react/components.test.tsx) |

## Dependencies

- **Upstream**: [US-008](../usecase/US-008-render-section-cards-automatically.md), [US-011](../usecase/US-011-render-api-endpoint-tables.md)
- **Calls**: [FR-010](./FR-010-usetable-hook.md)
- **Resilience**: [FR-028](./FR-028-render-error-boundaries.md)
