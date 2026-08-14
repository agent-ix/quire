---
id: StR-002
title: 'Structured document interaction'
type: StR
---

# StR-002: Structured document interaction

## Stakeholder Need

Developers SHALL be able to read from and write back to markdown documents at
the section level without losing content fidelity in non-edited sections or
frontmatter.

## Rationale

The spec editor UI needs to edit individual sections of a spec while preserving
overall document structure, frontmatter, and untouched content.

## Validation Criteria

| ID | Criteria | Validation |
|----|----------|------------|
| StR-002-VC-1 | A section can be updated programmatically and the resulting markdown round-trips without loss to other sections. | Test |
| StR-002-VC-2 | Frontmatter survives that same round-trip unchanged. | Test |

## Traceability (Informative)

Traced from by [US-006](../usecase/US-006-edit-a-section-and-write-back.md).
