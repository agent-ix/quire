---
id: US-015
title: 'Resolve standards alignment from frontmatter'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# [US-015] Resolve standards alignment from frontmatter

## Story

**As a** view developer
**I want** to extract `standards_alignment` codes from frontmatter and resolve them against a standards list
**So that** I can render linked standard badges.

## Context

`useStandardsAlignment(standards)` reads `standards_alignment` from frontmatter
and resolves each code against the supplied list, matching on `code`, `id`, or a
slugified `name` (case-insensitive). Unresolved codes are returned with
`resolved: false` and the raw code preserved as a display fallback.

## Acceptance Examples (Illustrative)

### [US-015-EX-1] Code list extracted

- **Given** frontmatter with `standards_alignment: [iso-iec-ieee-29148]`
- **When** read
- **Then** the code list is available.

### [US-015-EX-2] Resolved and unresolved

- **Given** a standards list
- **When** resolved
- **Then** known codes map to `id`/`name` and unknown codes keep `resolved: false`.

## Traceability (Informative)

Implemented by [FR-021](../functional/FR-021-standards-resolution-from-frontmatter.md).
