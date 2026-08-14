---
id: NFR-004
title: 'Theme integration'
type: NFR
relationships:
  - target: 'ix://agent-ix/quire/FR-015'
    type: 'constrains'
---

# NFR-004: Theme integration

## Attribute

Usability

## Statement

UI components SHALL be styleable without hardcoded colors so consumers can theme
them for light and dark modes.

## Measurement and Evaluation

| Metric | Target | Threshold | Method |
|--------|--------|-----------|--------|
| Hardcoded color values in component source | 0 | 0 | Inspection |
| Components exposing a stable CSS class name | all | all | Inspection |

## Verification

Read the component sources for literal color values in any form — hex, `rgb()`, or named — and confirm each component exposes the class name a consumer would target. Rendering under a light and a dark theme confirms nothing is pinned to one of them.

> The shipped components use plain CSS class names and do not import `ix-themes`, which `spec.md` prose claims (review finding BSF-1).

## Acceptance Criteria

| ID           | Criteria                                             | Verification |
| ------------ | ---------------------------------------------------- | ------------ |
| NFR-004-AC-1 | Component source contains no hardcoded color values  | Inspection   |
| NFR-004-AC-2 | Components expose stable CSS class names for theming | Inspection   |

> Backsync note: spec.md prose claims `ix-themes` token usage and ApplicationDetailPage
> parity. The shipped components use plain CSS class names and minimal inline
> layout styles; they do not import `ix-themes`. See review finding BSF-1.
