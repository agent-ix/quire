---
id: US-008
title: 'Render section cards automatically'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# [US-008] Render section cards automatically

## Story

**As a** view developer
**I want** pre-built section components (card, table, list, auto-render)
**So that** I don't have to build layouts for every view.

## Context

`SectionCard`, `SectionTable`, `SectionList`, and `AutoSections` render document
sections. Each accepts a custom renderer; when a renderer throws, the component
is resilient and falls back to a default rendering while logging the error
(see [FR-028](../functional/FR-028-render-error-boundaries.md)).

> NOTE: The shipped fallback renders raw section text in a `<pre>` block and
> uses CSS class names (`quire-section-card`, etc.) for theming. It does not
> import `markdown-editor` or `ix-themes`; consumers supply those via custom
> renderers and stylesheets. See review backsync finding BSF-1.

## Acceptance Examples (Illustrative)

### [US-008-EX-1] Card fallback

- **Given** `<SectionCard heading="Purpose" />` with no custom renderer
- **When** rendered
- **Then** the section content is shown in a themed card container.

### [US-008-EX-2] Auto-render

- **Given** `<AutoSections renderers={{...}} />`
- **When** rendered
- **Then** sections with a matching renderer use it; others fall back to the default.

### [US-008-EX-3] Renderer throws

- **Given** a custom renderer that throws
- **When** rendered
- **Then** the section falls back to the default and the error is logged.

## Traceability (Informative)

Implemented by [FR-015](../functional/FR-015-sectioncard-component.md),
[FR-016](../functional/FR-016-sectiontable-component.md),
[FR-017](../functional/FR-017-sectionlist-component.md),
[FR-018](../functional/FR-018-autosections-component.md),
[FR-028](../functional/FR-028-render-error-boundaries.md).
