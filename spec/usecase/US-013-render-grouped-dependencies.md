---
id: US-013
title: 'Group dependencies by type'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-013: Group dependencies by type

## Story

**As a** view developer
**I want** to classify dependency summaries into groups (Backend, Libraries, UI) by filter functions
**So that** the component hierarchy of an application is clear.

## Context

`groupDependencies(deps, groups)` (and the `useGroupedDependencies` hook)
classify a `DependencySummary[]` into named groups using each group's `filter`.
Filter errors are resilient: the item is excluded and the error logged
([FR-028](../functional/FR-028-render-error-boundaries.md)).

> NOTE: Quire ships the grouping logic and hook, NOT a `<GroupedDependencies>`
> rendering component with icons/onNavigate as the prose describes. The visual
> layout is the consumer's responsibility. See review finding BSF-3.

## Acceptance Examples (Illustrative)

### US-013-EX-1: Grouped by filter

- **Given** dependency summaries and group filters
- **When** grouped
- **Then** each dependency lands in the matching group.

### US-013-EX-2: Filter throws

- **Given** a filter that throws
- **When** grouping runs
- **Then** the item is excluded and the error is logged.

## Traceability (Informative)

Implemented by [FR-023](../functional/FR-023-grouped-dependency-renderer.md).
