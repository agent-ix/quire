---
id: US-007
title: 'Extract frontmatter'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-007: Extract frontmatter

## Story

**As a** view developer
**I want** to extract YAML frontmatter as a typed object
**So that** I can access metadata like `standards_alignment`, `component_type`, and `relationships`.

## Context

`extractFrontmatter()` parses `---`-delimited frontmatter into a key-value
object and returns the remaining body. It uses a lightweight YAML reader that
supports scalars, booleans, numbers, quoted strings, and single-line arrays;
nested objects and multi-line strings are out of scope.

## Acceptance Examples (Illustrative)

### US-007-EX-1: Frontmatter parsed

- **Given** a document with `---` delimited frontmatter
- **When** parsed
- **Then** frontmatter is available as a key-value object.

### US-007-EX-2: No frontmatter

- **Given** no frontmatter
- **When** parsed
- **Then** `null` is returned and the body is the full input.

### US-007-EX-3: Malformed YAML

- **Given** malformed YAML
- **When** parsed
- **Then** `null` is returned and the body is the full input (no throw).

## Traceability (Informative)

Implemented by [FR-005](../functional/FR-005-frontmatter-extraction.md).
