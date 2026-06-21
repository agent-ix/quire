---
id: FR-013
title: 'useDiagram hook'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-010'
    type: 'implements'
---

# [FR-013] useDiagram hook

## Description

`useDiagram(heading?)` SHALL return `DiagramBlock[]` from `extractDiagrams(doc)`.
With no `heading`, it returns all diagrams; with a `heading`, it returns only
blocks whose `section` matches case-insensitively.

## Inputs

- `heading?: string`

## Outputs

- `DiagramBlock[]`

## Acceptance Criteria

| ID          | Criteria                                     | Verification                      |
| ----------- | -------------------------------------------- | --------------------------------- |
| FR-013-AC-1 | No heading returns all diagrams              | Test (tests/react/hooks.test.tsx) |
| FR-013-AC-2 | A heading filters to that section's diagrams | Test (tests/react/hooks.test.tsx) |

## Dependencies

- **Upstream**: [US-010](../usecase/US-010-extract-diagrams.md)
- **Calls**: [FR-006](./FR-006-diagram-extraction.md)
