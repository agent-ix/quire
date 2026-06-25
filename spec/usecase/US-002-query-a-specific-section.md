---
id: US-002
title: 'Query a specific section'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-002: Query a specific section

## Story

**As a** view developer
**I want** to access a specific section by heading name and to full-text search across sections
**So that** I can render a targeted section without handling the whole document.

## Context

`section(doc, heading)` matches case-insensitively after stripping leading
section numbers (e.g. `## 2.1 In Scope`). `search(doc, query)` performs
case-insensitive full-text search across all section content.

## Acceptance Examples (Illustrative)

### US-002-EX-1: Heading lookup

- **Given** a parsed document
- **When** I query `section("Purpose")`
- **Then** I receive the `## Purpose` section.

### US-002-EX-2: Missing heading

- **Given** a heading that does not exist
- **When** queried
- **Then** I receive `null`.

### US-002-EX-3: Numbered headings match

- **Given** `## 2.1 In Scope`
- **When** I query `section("In Scope")`
- **Then** it still matches.

## Traceability (Informative)

Implemented by [FR-002](../functional/FR-002-section-query-by-heading.md)
and [FR-007](../functional/FR-007-full-text-search.md).
