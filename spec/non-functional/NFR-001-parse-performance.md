---
id: NFR-001
title: 'Parse performance'
type: NFR
relationships:
  - target: 'ix://agent-ix/quire/FR-001'
    type: 'constrains'
---

# NFR-001: Parse performance

## Attribute

Performance

## Statement

The parser SHALL handle large documents without perceptible delay.

## Measurement and Evaluation

| Metric | Target | Threshold | Method |
|--------|--------|-----------|--------|
| `parseDocument()` on a 500-section document | < 10 ms | 10 ms | Test |
| `extractFrontmatter()` on any document | < 1 ms | 1 ms | Test |
| Hook re-computation after a content change | 1 render cycle | 1 render cycle | Inspection |

## Verification

Run the parser against a generated 500-section document and a corpus of real spec files, timing `parseDocument()` and `extractFrontmatter()` over repeated runs and reading the slowest against the thresholds above. Re-computation is verified by inspecting that a content change drives exactly one render pass.

> No dedicated benchmark suite exists in `tests/` yet, so these thresholds are stated and not currently measured on every change (review finding BSF-7).

## Acceptance Criteria

| ID           | Criteria                                                                 | Verification |
| ------------ | ------------------------------------------------------------------------ | ------------ |
| NFR-001-AC-1 | `parseDocument()` completes in < 10ms for a 500-section document         | Test (perf)  |
| NFR-001-AC-2 | `extractFrontmatter()` completes in < 1ms for any document               | Test (perf)  |
| NFR-001-AC-3 | Hook re-computation after a content change completes in one render cycle | Inspection   |

> Status note: a dedicated performance benchmark suite is not yet present in
> `tests/`. See review finding BSF-7.
