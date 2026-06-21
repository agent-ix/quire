---
id: US-005
title: 'React context for document state'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# [US-005] React context for document state

## Story

**As a** view developer
**I want** a React context that holds the parsed document state
**So that** child components can access sections without prop drilling.

## Context

`<QuireProvider content={md}>` parses content once (memoized) and exposes it via
hooks (`useQuire`, `useSection`, `useTable`, `useList`, `useFrontmatter`,
`useDiagram`). Hooks used outside a provider throw `QuireContextError`.

## Acceptance Examples (Illustrative)

### [US-005-EX-1] Child reads a section

- **Given** `<QuireProvider content={md}>`
- **When** a child calls `useSection("Purpose")`
- **Then** it receives the section content.

### [US-005-EX-2] Re-parse on change

- **Given** the `content` prop changes
- **When** hooks read again
- **Then** they reflect the new content.

### [US-005-EX-3] Hook outside provider

- **Given** a hook called outside `<QuireProvider>`
- **When** rendered
- **Then** a descriptive `QuireContextError` is thrown.

## Traceability (Informative)

Implemented by [FR-008](../functional/FR-008-quireprovider-react-context.md),
[FR-009](../functional/FR-009-usesection-hook.md),
[FR-010](../functional/FR-010-usetable-hook.md),
[FR-011](../functional/FR-011-uselist-hook.md),
[FR-012](../functional/FR-012-usefrontmatter-hook.md),
[FR-013](../functional/FR-013-usediagram-hook.md).
