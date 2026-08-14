---
id: NFR-002
title: 'Round-trip fidelity'
type: NFR
relationships:
  - target: 'ix://agent-ix/quire/FR-014'
    type: 'constrains'
---

# NFR-002: Round-trip fidelity

## Attribute

Reliability

## Statement

Markdown content SHALL survive parse → write-back cycles without loss or
corruption of frontmatter or non-edited sections.

## Measurement and Evaluation

| Metric | Target | Threshold | Method |
|--------|--------|-----------|--------|
| Non-edited sections altered by a write-back | 0 | 0 | Test |
| Frontmatter altered by a write-back | 0 | 0 | Test |
| Real ecosystem documents in the fidelity corpus | > 0 | > 0 | Inspection |

## Verification

Modify one section through the write-back API and compare every other section and the frontmatter byte-for-byte against the input. Repeat across a corpus of real ecosystem spec documents so fidelity is measured on authored markdown rather than on fixtures alone.

> AC-1 and AC-2 are covered by `tests/core/writeback.test.ts`; the multi-document corpus suite (AC-3) does not exist yet (review finding BSF-7).

## Acceptance Criteria

| ID           | Criteria                                                            | Verification                        |
| ------------ | ------------------------------------------------------------------- | ----------------------------------- |
| NFR-002-AC-1 | A write-back that modifies one section preserves all other sections | Test (tests/core/writeback.test.ts) |
| NFR-002-AC-2 | Frontmatter is preserved across write-back                          | Test (tests/core/writeback.test.ts) |
| NFR-002-AC-3 | A fidelity suite covers a corpus of real ecosystem spec documents   | Inspection                          |

> Status note: AC-1/AC-2 are covered by writeback tests. A multi-document corpus
> fidelity suite (AC-3) is not yet present. See review finding BSF-7.
