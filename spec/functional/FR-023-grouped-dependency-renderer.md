---
id: FR-023
title: 'Grouped dependency classification'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-013'
    type: 'implements'
---

# FR-023: Grouped dependency classification

## Description

`groupDependencies(deps, groups)` (and the `useGroupedDependencies` hook) SHALL
classify a `DependencySummary[]` into named groups by each group's `filter`,
returning `{ key, label, items }[]`. A filter that throws is resilient: the item
is excluded from that group and the error is logged via `console.error`
([FR-028](./FR-028-render-error-boundaries.md)).

> Implementation note: the shipped surface is a grouping function + hook, NOT a
> `<GroupedDependencies>` rendering component with `icon`/`onNavigate`/count
> badges as spec.md prose describes. Layout/navigation is the consumer's
> responsibility. See review finding BSF-3.

## Inputs

- `dependencies: T[]`, `groups: DependencyGroup<T>[]`

## Outputs

- `GroupedResult<T>[]` — `{ key, label, items }`

## Acceptance Criteria

| ID          | Criteria                                                 | Verification                           |
| ----------- | -------------------------------------------------------- | -------------------------------------- |
| FR-023-AC-1 | Dependencies are classified into groups by their filters | Test (tests/react/extensions.test.tsx) |
| FR-023-AC-2 | A throwing filter excludes the item and logs the error   | Test (tests/react/extensions.test.tsx) |

## Dependencies

- **Upstream**: [US-013](../usecase/US-013-render-grouped-dependencies.md)
- **Resilience**: [FR-028](./FR-028-render-error-boundaries.md)
