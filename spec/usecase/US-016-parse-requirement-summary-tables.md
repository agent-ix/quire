---
id: US-016
title: 'Parse requirement summary tables'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-016: Parse requirement summary tables

## Story

**As a** view developer
**I want** to parse markdown tables under headings like "Functional Requirements" or "User Stories" into rows
**So that** I can render them as navigable requirement lists.

## Context

This is achieved with the generic table primitives — `tableFromSection(doc,
heading)` / `useTable(heading)` return `{ headers, rows }` for the named
section, with header and separator rows stripped. There is no requirement-
specific typed parser; the consumer maps the generic rows to its own shape.

## Acceptance Examples (Illustrative)

### US-016-EX-1: Generic rows

- **Given** a table under `## Functional Requirements` with `ID | Title | Type`
- **When** read via `useTable`
- **Then** I receive header-stripped rows the view can map to `{ id, title, type }`.

### US-016-EX-2: Separators stripped

- **Given** a markdown table
- **When** parsed
- **Then** the header separator row (`---`) is excluded.

## Traceability (Informative)

Implemented by [FR-003](../functional/FR-003-table-extraction.md)
and [FR-010](../functional/FR-010-usetable-hook.md).
