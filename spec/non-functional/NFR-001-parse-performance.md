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

## Description

The parser SHALL handle large documents without perceptible delay.

## Acceptance Criteria

| ID           | Criteria                                                                 | Verification |
| ------------ | ------------------------------------------------------------------------ | ------------ |
| NFR-001-AC-1 | `parseDocument()` completes in < 10ms for a 500-section document         | Test (perf)  |
| NFR-001-AC-2 | `extractFrontmatter()` completes in < 1ms for any document               | Test (perf)  |
| NFR-001-AC-3 | Hook re-computation after a content change completes in one render cycle | Inspection   |

> Status note: a dedicated performance benchmark suite is not yet present in
> `tests/`. See review finding BSF-7.
