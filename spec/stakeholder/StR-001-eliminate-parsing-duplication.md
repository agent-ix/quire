---
id: StR-001
title: 'Eliminate parsing duplication'
type: StR
---

# StR-001: Eliminate parsing duplication

## Statement

The ecosystem SHALL have a single, reusable library for parsing markdown
documents into structured sections, querying their content, and rendering them,
replacing the inline parsing logic re-implemented across consumer views.

## Rationale

Multiple views independently re-implement `getSectionContent()`,
`parseTableFromSection()`, and bullet-list parsing. This duplication causes
inconsistent behavior and high maintenance burden.

## Success Indicators

View code (e.g. ApplicationDetailPage, StandardDetail) consumes Quire instead of
inline parsing logic, with consistent parsing behavior across views.

## Traceability (Informative)

Traced from by user stories US-001 through US-018.
