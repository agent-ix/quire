---
id: US-004
title: 'Extract structured lists'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-004: Extract structured lists

## Story

**As a** view developer
**I want** to extract bullet lists with structured patterns (e.g. `**Title** — Description`)
**So that** I can render them as feature cards.

## Context

`parseBulletList()` returns `{ raw, title, description }` items. The
`bold-description` and `bold-colon` patterns split a bold title from its
description; plain items keep the full text as `title`.

## Acceptance Examples (Illustrative)

### US-004-EX-1: Bold-description split

- **Given** `- **Auth** — Token-based authentication`
- **When** parsed
- **Then** `title` is "Auth" and `description` is "Token-based authentication".

### US-004-EX-2: Plain item

- **Given** `- Simple item`
- **When** parsed
- **Then** `title` is "Simple item" and `description` is empty.

## Traceability (Informative)

Implemented by [FR-004](../functional/FR-004-structured-list-extraction.md).
