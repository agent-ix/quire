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

## Statement

All layers SHALL maintain test coverage above the established thresholds, and
every FR SHALL have at least one corresponding test case.

## Measurement and Evaluation

| Metric | Target | Threshold | Method |
|--------|--------|-----------|--------|
| Line coverage, parser and query layers | ≥ 90% | 90% | Test |
| Line coverage, React components and hooks | ≥ 80% | 80% | Test |
| Functional requirements with no test case | 0 | 0 | Inspection |

## Verification

Read line coverage per layer from `vitest --coverage` and compare each against its threshold. FR coverage is verified by reconciling `spec/tests.md` against the functional requirements, so a requirement with no test case is visible rather than implied.

## Acceptance Criteria

| ID           | Criteria                                                      | Verification             |
| ------------ | ------------------------------------------------------------- | ------------------------ |
| NFR-005-AC-1 | Layer 1+2 (parser/query) maintain ≥ 90% line coverage         | Test (vitest --coverage) |
| NFR-005-AC-2 | Layer 3 (React components/hooks) maintain ≥ 80% line coverage | Test (vitest --coverage) |
| NFR-005-AC-3 | Every FR has at least one corresponding test case             | Inspection (tests.md)    |
