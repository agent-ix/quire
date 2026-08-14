---
id: NFR-003
title: 'Bundle size and tree-shakeability'
type: NFR
relationships:
  - target: 'ix://agent-ix/quire/FR-001'
    type: 'constrains'
---

# NFR-003: Bundle size and tree-shakeability

## Attribute

Portability

## Statement

Layer 1+2 (parser/query) SHALL be usable without React so non-UI consumers
(agents, scripts, CLI) can use the parsing/query API. The package exposes a
`./core` entry with zero React imports.

## Measurement and Evaluation

| Metric | Target | Threshold | Method |
|--------|--------|-----------|--------|
| React imports under `src/core` | 0 | 0 | Inspection |
| React packages required to import the core entry | 0 | 0 | Test |
| Library bundle size, gzipped, excluding peer deps | < 50 KB | 50 KB | Test |

## Verification

Grep `src/core` for React imports, then import the `./core` entry in a project with no React in its dependency tree and confirm it resolves and runs. Bundle size is read from the production build's gzipped output with peer dependencies excluded.

## Acceptance Criteria

| ID           | Criteria                                                        | Verification      |
| ------------ | --------------------------------------------------------------- | ----------------- |
| NFR-003-AC-1 | Layer 1+2 (`src/core`) modules have zero React imports          | Inspection (grep) |
| NFR-003-AC-2 | The core API is importable without React in the dependency tree | Inspection        |
| NFR-003-AC-3 | The full library bundle is < 50KB gzipped (excluding peer deps) | Test (build)      |
