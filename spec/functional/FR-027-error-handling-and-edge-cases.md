---
id: FR-027
title: 'Error handling and edge cases'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-001'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-003'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-007'
    type: 'implements'
---

# [FR-027] Error handling and edge cases

## Description

The Layer 1+2 parsing/query functions SHALL handle malformed and edge-case input
gracefully. Empty input yields an empty document. Malformed YAML yields `null`
frontmatter with the body preserved. Unclosed fenced blocks are tolerated.
Headings with empty content yield empty-string `content`. `null`/`undefined`
input to parser functions throws a descriptive `TypeError`.

## Inputs

- Malformed / empty / null markdown across parser and query functions

## Outputs

- Safe defaults, or a descriptive `TypeError` for null/undefined input

## Acceptance Criteria

| ID          | Criteria                                                                        | Verification                                          |
| ----------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| FR-027-AC-1 | Empty string to `parseDocument()` → `{ preamble: null, sections: [], raw: '' }` | Test (tests/core/parser.test.ts)                      |
| FR-027-AC-2 | Malformed YAML → `{ frontmatter: null, body: fullInput }` (no throw)            | Test (tests/core/frontmatter.test.ts)                 |
| FR-027-AC-3 | An unclosed fenced block is handled without throwing                            | Test (tests/core/parser.test.ts)                      |
| FR-027-AC-4 | A heading with empty content has `content` `""`                                 | Test (tests/core/parser.test.ts)                      |
| FR-027-AC-5 | `null`/`undefined` input to parser functions throws `TypeError`                 | Test (tests/core/parser.test.ts, frontmatter.test.ts) |

## Dependencies

- **Upstream**: [US-001](../usecase/US-001-parse-a-spec-into-sections.md), [US-003](../usecase/US-003-extract-tables-from-sections.md), [US-007](../usecase/US-007-extract-frontmatter.md)
