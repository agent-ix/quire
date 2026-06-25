---
id: FR-019
title: 'Delegation annotation parsing'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-012'
    type: 'implements'
---

# FR-019: Delegation annotation parsing

## Description

`parseDelegations(content)` SHALL extract bullet items and parse delegation
annotations of the form `(handled by X)` or `(delegated to X)` (case-insensitive).
For an annotated item it returns `{ item, delegation }` with the annotation
removed from `item` and `X` as `delegation`; otherwise `delegation` is
`undefined`. Throws `TypeError` on `null`/`undefined` input.

## Inputs

- `content: string`

## Outputs

- `DelegatedItem[]` — `{ item: string, delegation: string | undefined }`

## Acceptance Criteria

| ID          | Criteria                                                                                  | Verification                    |
| ----------- | ----------------------------------------------------------------------------------------- | ------------------------------- |
| FR-019-AC-1 | `- Auth tokens (handled by auth-service)` → item "Auth tokens", delegation "auth-service" | Test (tests/core/query.test.ts) |
| FR-019-AC-2 | `(delegated to X)` is parsed the same way                                                 | Test (tests/core/query.test.ts) |
| FR-019-AC-3 | An item with no annotation has `delegation` `undefined`                                   | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-012](../usecase/US-012-render-delegated-concerns.md)
