---
id: FR-014
title: 'Section update and write-back'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-006'
    type: 'implements'
---

# [FR-014] Section update and write-back

## Description

`updateSection(doc, heading, newContent)` SHALL locate the named section, replace
its content lines in `doc.raw`, and return the full updated markdown. The
frontmatter line offset is accounted for so the replacement targets the correct
raw lines. Other sections and the frontmatter are preserved. A missing heading
SHALL throw `Error("Section \"<heading>\" not found in document")`.

## Inputs

- `doc: QuireDocument`, `heading: string`, `newContent: string`

## Outputs

- `string` — full updated markdown

## Acceptance Criteria

| ID          | Criteria                                 | Verification                        |
| ----------- | ---------------------------------------- | ----------------------------------- |
| FR-014-AC-1 | The target section's content is replaced | Test (tests/core/writeback.test.ts) |
| FR-014-AC-2 | Other sections remain unchanged          | Test (tests/core/writeback.test.ts) |
| FR-014-AC-3 | Frontmatter is preserved                 | Test (tests/core/writeback.test.ts) |
| FR-014-AC-4 | A non-existent heading throws an Error   | Test (tests/core/writeback.test.ts) |

## Dependencies

- **Upstream**: [US-006](../usecase/US-006-edit-a-section-and-write-back.md)
- **Calls**: [FR-002](./FR-002-section-query-by-heading.md)
- **Quality**: [NFR-002](../non-functional/NFR-002-round-trip-fidelity.md)
