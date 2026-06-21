---
id: US-012
title: 'Parse delegation annotations from lists'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# [US-012] Parse delegation annotations from lists

## Story

**As a** view developer
**I want** to parse a bullet list and extract delegation annotations like `(handled by auth-service)`
**So that** delegated concerns display with a link to the responsible component.

## Context

`parseDelegations(content)` returns `{ item, delegation }` per bullet, stripping
the `(handled by X)` / `(delegated to X)` annotation from `item` and capturing
`X` as `delegation` (or `undefined`). `SectionList` renders parsed items.

## Acceptance Examples (Illustrative)

### [US-012-EX-1] Delegation captured

- **Given** `- Auth tokens (handled by auth-service)`
- **When** parsed
- **Then** `item` is "Auth tokens" and `delegation` is "auth-service".

### [US-012-EX-2] No annotation

- **Given** `- Simple item`
- **When** parsed
- **Then** `delegation` is `undefined`.

## Traceability (Informative)

Implemented by [FR-019](../functional/FR-019-delegation-annotation-parsing.md)
and [FR-017](../functional/FR-017-sectionlist-component.md).
