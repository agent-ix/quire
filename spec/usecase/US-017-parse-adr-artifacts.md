---
id: US-017
title: 'Parse ADR artifacts'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-017: Parse ADR artifacts

## Story

**As a** view developer
**I want** to parse an Architecture Decision Record into Context, Decision, Rationale, and Status
**So that** I can render it as a decision card.

## Context

`parseADRFromContent(content)` extracts the Context, Decision, and Rationale
sub-sections (nullable when absent), defaults Status to "Accepted" when missing,
and collects embedded mermaid diagrams. It returns `null` for empty content.

> NOTE: The shipped signature is `parseADRFromContent(content)` returning
> nullable fields plus `diagrams`, not the spec's `parseADR(content, meta)`
> with a `raw` field. See review finding BSF-5.

## Acceptance Examples (Illustrative)

### US-017-EX-1: Sections extracted

- **Given** an ADR with `## Context`, `## Decision`, `## Rationale`
- **When** parsed
- **Then** each section's content is extracted.

### US-017-EX-2: Default status

- **Given** no Status section
- **When** parsed
- **Then** `status` defaults to "Accepted".

## Traceability (Informative)

Implemented by [FR-022](../functional/FR-022-adr-artifact-section-parser.md).
