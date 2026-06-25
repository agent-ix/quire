---
id: US-011
title: 'Render API endpoint tables with custom cell renderers'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-011: Render API endpoint tables with custom cell renderers

## Story

**As a** view developer
**I want** to parse an "API Endpoints" markdown table and render cells with custom components (e.g. method badges)
**So that** API surfaces are scannable at a glance.

## Context

`SectionTable` parses the named section's table and renders it. A
`cellRenderers` map keyed by column name lets the consumer supply per-column
React (e.g. a colored method badge). Quire does not ship the badge components
itself — it supplies the parsed rows and the per-cell render hook.

> NOTE: Method-to-color mapping and backtick stripping are consumer concerns,
> implemented inside the supplied `cellRenderers`. See review finding BSF-2.

## Acceptance Examples (Illustrative)

### US-011-EX-1: Typed rows

- **Given** a table under `## API Endpoints`
- **When** parsed by `SectionTable`
- **Then** rows are available to `cellRenderers` keyed by column.

### US-011-EX-2: Custom cell

- **Given** a `cellRenderers.Method` function
- **When** the table renders
- **Then** the Method column uses that renderer.

## Traceability (Informative)

Implemented by [FR-016](../functional/FR-016-sectiontable-component.md)
and [FR-003](../functional/FR-003-table-extraction.md).
