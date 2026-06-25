---
id: FR-002
title: 'Section query by heading'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-002'
    type: 'implements'
---

# FR-002: Section query by heading

## Description

The `section(doc, heading)` function SHALL locate a section by heading text,
matching case-insensitively after stripping leading section numbers (regex
`^\d+(\.\d+)*\.?\s*`) from BOTH the stored heading and the query, then comparing
for equality (not substring). It searches the full tree depth-first and returns
`null` when no match is found. `sections(doc, opts?)` SHALL return all sections,
optionally filtered to a single `level`.

## Inputs

- `doc: QuireDocument`, `heading: string`
- `sections(doc, { level?: number })`

## Outputs

- `QuireSection | null` (single) / `QuireSection[]` (collection)

## Acceptance Criteria

| ID          | Criteria                                                                   | Verification                    |
| ----------- | -------------------------------------------------------------------------- | ------------------------------- |
| FR-002-AC-1 | "Purpose" matches `## Purpose`, `## 1. Purpose`, and `### Purpose`         | Test (tests/core/query.test.ts) |
| FR-002-AC-2 | Matching is case-insensitive ("in scope" matches `## In Scope`)            | Test (tests/core/query.test.ts) |
| FR-002-AC-3 | A non-existent heading returns `null`                                      | Test (tests/core/query.test.ts) |
| FR-002-AC-4 | `sections(doc, { level: 2 })` returns only level-2 sections                | Test (tests/core/query.test.ts) |
| FR-002-AC-5 | "Scope" does NOT match `## 2.1 In Scope` (equality after number stripping) | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-002](../usecase/US-002-query-a-specific-section.md)
