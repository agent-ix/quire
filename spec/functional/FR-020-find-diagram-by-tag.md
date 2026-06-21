---
id: FR-020
title: 'Find diagram by tag'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-014'
    type: 'implements'
---

# [FR-020] Find diagram by tag

## Description

`findDiagramByTag(blocks, tag)` SHALL return the FIRST `DiagramBlock` in the
supplied array whose `tag` equals the given value, or `null` if none match.

> Implementation note: this REPLACES the spec.md `classifyDiagrams()` function,
> which does not exist in the code. Diagram typing is explicit via the
> `%% @type:` annotation read by [FR-006](./FR-006-diagram-extraction.md), not
> inferred from keywords. See review finding BSF-4.

## Inputs

- `blocks: DiagramBlock[]`, `tag: string`

## Outputs

- `DiagramBlock | null`

## Acceptance Criteria

| ID          | Criteria                                       | Verification                    |
| ----------- | ---------------------------------------------- | ------------------------------- |
| FR-020-AC-1 | Returns the first block whose `tag` matches    | Test (tests/core/query.test.ts) |
| FR-020-AC-2 | Returns `null` when no block has the given tag | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-014](../usecase/US-014-classify-mermaid-diagrams.md)
- **Related**: [FR-006](./FR-006-diagram-extraction.md)
