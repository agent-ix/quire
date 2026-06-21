---
id: NFR-003
title: 'Bundle size and tree-shakeability'
type: NFR
relationships:
  - target: 'ix://agent-ix/quire/FR-001'
    type: 'constrains'
---

# [NFR-003] Bundle size and tree-shakeability

## Attribute

Portability

## Description

Layer 1+2 (parser/query) SHALL be usable without React so non-UI consumers
(agents, scripts, CLI) can use the parsing/query API. The package exposes a
`./core` entry with zero React imports.

## Acceptance Criteria

| ID           | Criteria                                                        | Verification      |
| ------------ | --------------------------------------------------------------- | ----------------- |
| NFR-003-AC-1 | Layer 1+2 (`src/core`) modules have zero React imports          | Inspection (grep) |
| NFR-003-AC-2 | The core API is importable without React in the dependency tree | Inspection        |
| NFR-003-AC-3 | The full library bundle is < 50KB gzipped (excluding peer deps) | Test (build)      |
