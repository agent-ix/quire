---
id: US-018
title: 'Extract FR process diagrams from child artifacts'
type: US
relationships:
  - target: 'ix://agent-ix/quire/StR-001'
    type: 'traces_to'
---

# US-018: Extract FR process diagrams from child artifacts

## Story

**As a** view developer
**I want** to extract mermaid diagrams from a supplied list of FR artifacts
**So that** I can render a "Process Diagrams" section for key requirements.

## Context

`extractFRDiagrams(artifacts)` scans each `{ id, title, content }` artifact for
mermaid fenced blocks and returns `{ frId, frTitle, source }` for each diagram
found.

## Acceptance Examples (Illustrative)

### US-018-EX-1: Diagrams extracted with FR identity

- **Given** a list of FR artifacts, some containing mermaid blocks
- **When** scanned
- **Then** each diagram is returned with its FR id and title.

## Traceability (Informative)

Implemented by [FR-024](../functional/FR-024-extract-fr-process-diagrams.md).
