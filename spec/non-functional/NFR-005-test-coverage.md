---
id: NFR-005
title: 'Test coverage'
type: NFR
relationships:
  - target: 'ix://agent-ix/quire/FR-001'
    type: 'constrains'
---

# NFR-005: Test coverage

## Attribute

Maintainability

## Description

All layers SHALL maintain test coverage above the established thresholds, and
every FR SHALL have at least one corresponding test case.

## Acceptance Criteria

| ID           | Criteria                                                      | Verification             |
| ------------ | ------------------------------------------------------------- | ------------------------ |
| NFR-005-AC-1 | Layer 1+2 (parser/query) maintain ≥ 90% line coverage         | Test (vitest --coverage) |
| NFR-005-AC-2 | Layer 3 (React components/hooks) maintain ≥ 80% line coverage | Test (vitest --coverage) |
| NFR-005-AC-3 | Every FR has at least one corresponding test case             | Inspection (tests.md)    |
