---
id: StR-001
title: 'Eliminate parsing duplication'
type: StR
---

# StR-001: Eliminate parsing duplication

## Stakeholder Need

The ecosystem SHALL have a single, reusable library for parsing markdown
documents into structured sections, querying their content, and rendering them,
replacing the inline parsing logic re-implemented across consumer views.

## Rationale

Multiple views independently re-implement `getSectionContent()`,
`parseTableFromSection()`, and bullet-list parsing. This duplication causes
inconsistent behavior and high maintenance burden.

## Validation Criteria

| ID | Criteria | Validation |
|----|----------|------------|
| StR-001-VC-1 | View code such as `ApplicationDetailPage` and `StandardDetail` consumes Quire instead of inline parsing logic. | Inspection |
| StR-001-VC-2 | Parsing behaviour is consistent across the views that adopted the library. | Demonstration |

## Traceability (Informative)

Traced from by user stories US-001 through US-018.
