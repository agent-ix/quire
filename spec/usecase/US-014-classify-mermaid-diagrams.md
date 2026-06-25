---
id: US-014
title: 'Tag and locate diagrams by type'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-014: Tag and locate diagrams by type

## Story

**As a** view developer
**I want** to read an explicit type tag from each diagram and find a diagram by that tag
**So that** I can render a toggled architecture view (e.g. logical vs deployment).

## Context

The shipped engine does NOT auto-classify diagrams by keyword. Instead,
`extractDiagrams()` reads an explicit `%% @type: <value>` annotation inside the
fenced block into `DiagramBlock.tag`, and `findDiagramByTag(blocks, tag)`
returns the first block with that tag.

> NOTE: This supersedes the spec prose describing keyword-based "logical" vs
> "deployment" classification and a `classifyDiagrams()` function. Neither the
> keyword classifier nor `classifyDiagrams()` exists in the code. See review
> finding BSF-4.

## Acceptance Examples (Illustrative)

### US-014-EX-1: Tag read

- **Given** a mermaid block containing `%% @type: deployment`
- **When** extracted
- **Then** the block's `tag` is "deployment".

### US-014-EX-2: Find by tag

- **Given** several diagrams
- **When** I call `findDiagramByTag(blocks, "logical")`
- **Then** I receive the first block tagged "logical", or `null`.

## Traceability (Informative)

Implemented by [FR-006](../functional/FR-006-diagram-extraction.md)
and [FR-020](../functional/FR-020-find-diagram-by-tag.md).
