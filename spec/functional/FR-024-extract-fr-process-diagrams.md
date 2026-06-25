---
id: FR-024
title: 'Extract FR process diagrams from artifacts'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-018'
    type: 'implements'
---

# FR-024: Extract FR process diagrams from artifacts

## Description

`extractFRDiagrams(artifacts)` SHALL scan each `{ id, title, content }` artifact
for mermaid fenced blocks and return one `{ frId, frTitle, source }` per diagram
found, in order.

> Numbering note: spec.md does not assign a distinct FR ID to this capability
> (it is mentioned under US-018 alongside the unimplemented FR-018 prose). This FR
> formalizes the shipped `extractFRDiagrams` function as FR-024.

## Inputs

- `artifacts: Array<{ id: string; title: string; content: string }>`

## Outputs

- `FRDiagram[]` — `{ frId, frTitle, source }`

## Acceptance Criteria

| ID          | Criteria                                                        | Verification                           |
| ----------- | --------------------------------------------------------------- | -------------------------------------- |
| FR-024-AC-1 | Each mermaid block is returned with its source                  | Test (tests/react/extensions.test.tsx) |
| FR-024-AC-2 | Each diagram carries the owning artifact's `frId` and `frTitle` | Test (tests/react/extensions.test.tsx) |

## Dependencies

- **Upstream**: [US-018](../usecase/US-018-extract-fr-process-diagrams.md)
