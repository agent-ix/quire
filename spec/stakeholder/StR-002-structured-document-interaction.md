---
id: StR-002
title: 'Structured document interaction'
type: StR
---

# [StR-002] Structured document interaction

## Statement

Developers SHALL be able to read from and write back to markdown documents at
the section level without losing content fidelity in non-edited sections or
frontmatter.

## Rationale

The spec editor UI needs to edit individual sections of a spec while preserving
overall document structure, frontmatter, and untouched content.

## Success Indicators

A section can be updated programmatically and the resulting markdown round-trips
without loss to other sections or frontmatter.

## Traceability (Informative)

Traced from by [US-006](../usecase/US-006-edit-a-section-and-write-back.md).
