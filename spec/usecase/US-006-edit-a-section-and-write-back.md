---
id: US-006
title: 'Edit a section and write back'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-002'
    type: 'traces_to'
---

# US-006: Edit a section and write back

## Story

**As a** view developer
**I want** to update a specific section's content and get the full markdown back with the change applied
**So that** I can save it to the API.

## Context

`updateSection(doc, heading, newContent)` replaces a section's content in the
raw markdown and returns the full updated document, preserving frontmatter and
all other sections. The `useSection().update()` helper wires this to the
provider's `onChange`.

## Acceptance Examples (Illustrative)

### US-006-EX-1: Section replaced

- **Given** a document
- **When** I call `updateSection("Purpose", newContent)`
- **Then** the returned markdown has the Purpose section replaced.

### US-006-EX-2: Others unchanged

- **Given** the update above
- **When** I inspect other sections and the frontmatter
- **Then** they remain unchanged.

## Traceability (Informative)

Implemented by [FR-014](../functional/FR-014-section-update-and-write-back.md).
