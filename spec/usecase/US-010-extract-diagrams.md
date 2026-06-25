---
id: US-010
title: 'Extract diagrams'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-010: Extract diagrams

## Story

**As a** view developer
**I want** to extract fenced diagram blocks (e.g. mermaid) from the document
**So that** I can render them with a diagram-renderer component.

## Context

`extractDiagrams(doc, opts?)` returns `DiagramBlock[]` with `index`, `language`,
`source`, `section`, and `tag`. The optional `language` filter restricts results
to one fence language. The `useDiagram(heading?)` hook surfaces this in React.

## Acceptance Examples (Illustrative)

### US-010-EX-1: All diagrams

- **Given** a document with mermaid fenced blocks
- **When** I call `extractDiagrams(doc)`
- **Then** I receive each block's source string.

### US-010-EX-2: Per-section

- **Given** a diagram inside `## Architecture`
- **When** I read `useDiagram("Architecture")`
- **Then** I receive only that section's diagram(s).

## Traceability (Informative)

Implemented by [FR-006](../functional/FR-006-diagram-extraction.md)
and [FR-013](../functional/FR-013-usediagram-hook.md).
