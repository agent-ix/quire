---
id: US-001
title: 'Parse a spec into sections'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-001: Parse a spec into sections

## Story

**As a** view developer
**I want** to parse a markdown spec document into named, hierarchical sections
**So that** I can render each section as an independent card in the UI without re-implementing a parser.

## Context

Many spec-editor views split markdown by `##` headings into sections. Quire's
`parseDocument()` provides this once: it returns a `QuireDocument` with a
`preamble`, a tree of `sections`, parsed `frontmatter`, and the original `raw`
markdown.

## Acceptance Examples (Illustrative)

### US-001-EX-1: Headings become sections

- **Given** a markdown string with `##` headings
- **When** it is parsed
- **Then** each heading becomes a named section with its content.

### US-001-EX-2: Nested headings form a hierarchy

- **Given** nested headings (`##`, `###`, `####`)
- **When** parsed
- **Then** sub-sections nest under their parent.

### US-001-EX-3: Empty input is safe

- **Given** an empty string
- **When** parsed
- **Then** `preamble` is `null` and `sections` is `[]` (no throw).

## Traceability (Informative)

Implemented by [FR-001](../functional/FR-001-parse-document-into-section-tree.md)
and [FR-027](../functional/FR-027-error-handling-and-edge-cases.md).
