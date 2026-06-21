---
id: US-003
title: 'Extract tables from sections'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# [US-003] Extract tables from sections

## Story

**As a** view developer
**I want** to extract markdown tables from a section as typed row arrays
**So that** I can render them in structured table components.

## Context

`parseTable()` returns `{ headers, rows }` from the first table in a string.
`parseTables()` returns all tables. `tableFromSection(doc, heading)` is a
convenience that locates the section then parses its first table.

## Acceptance Examples (Illustrative)

### [US-003-EX-1] Table to rows

- **Given** a section containing a markdown table
- **When** I extract it
- **Then** I receive header-stripped row arrays.

### [US-003-EX-2] No table

- **Given** a section with no table
- **When** extracted
- **Then** I receive empty headers and rows.

### [US-003-EX-3] Multiple tables

- **Given** a section with multiple tables
- **When** I call `parseTables()`
- **Then** I receive all of them.

## Traceability (Informative)

Implemented by [FR-003](../functional/FR-003-table-extraction.md).
