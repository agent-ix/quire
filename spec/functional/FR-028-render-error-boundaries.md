---
id: FR-028
title: 'Render error boundaries'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-008'
    type: 'implements'
---

# [FR-028] Render error boundaries

## Description

Render-callback extension points SHALL be RESILIENT: when a `render`,
`cellRenderers`, `renderers`, or `groupDependencies` `filter` callback throws, the
error is caught and the component falls back to a safe default (raw text for
sections/cells, exclusion for filtered items), logging via `console.error`.
Mutation callbacks (`onChange`, `onRowClick`) are STRICT and propagate.

## Inputs

- Throwing render/filter callbacks supplied by consumers

## Outputs

- Safe fallback rendering + a logged error (resilient), or a propagated error (strict)

## Acceptance Criteria

| ID          | Criteria                                                            | Verification                           |
| ----------- | ------------------------------------------------------------------- | -------------------------------------- |
| FR-028-AC-1 | A throwing `SectionCard.render` falls back to raw text, logs error  | Test (tests/react/components.test.tsx) |
| FR-028-AC-2 | A throwing `SectionTable.cellRenderers` cell falls back to raw text | Test (tests/react/components.test.tsx) |
| FR-028-AC-3 | A throwing `AutoSections.renderers` entry falls back to raw text    | Test (tests/react/components.test.tsx) |
| FR-028-AC-4 | A throwing `groupDependencies` filter excludes the item, logs error | Test (tests/react/extensions.test.tsx) |

## Dependencies

- **Upstream**: [US-008](../usecase/US-008-render-section-cards-automatically.md)
