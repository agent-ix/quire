---
id: FR-018
title: 'AutoSections component'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-008'
    type: 'implements'
---

# FR-018: AutoSections component

## Description

`<AutoSections exclude? renderers? className?>` SHALL render the document's
top-level sections in order. A section with a matching entry in `renderers`
(keyed by heading) uses that renderer (wrapped in an error boundary); otherwise it
falls back to a `SectionCard`. Headings listed in `exclude` (case-insensitive)
are omitted.

## Inputs

- `exclude?: string[]`, `renderers?: Record<string, SectionRenderer>`, `className?`

## Outputs

- A container rendering each visible section

## Acceptance Criteria

| ID          | Criteria                                              | Verification                           |
| ----------- | ----------------------------------------------------- | -------------------------------------- |
| FR-018-AC-1 | All top-level sections render in document order       | Test (tests/react/components.test.tsx) |
| FR-018-AC-2 | A matching `renderers` entry is used for that section | Test (tests/react/components.test.tsx) |
| FR-018-AC-3 | Sections without a renderer fall back to SectionCard  | Test (tests/react/components.test.tsx) |
| FR-018-AC-4 | `exclude` headings are omitted                        | Test (tests/react/components.test.tsx) |

## Dependencies

- **Upstream**: [US-008](../usecase/US-008-render-section-cards-automatically.md)
- **Calls**: [FR-015](./FR-015-sectioncard-component.md)
- **Resilience**: [FR-028](./FR-028-render-error-boundaries.md)
