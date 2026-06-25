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

## Description

UI components SHALL be styleable without hardcoded colors so consumers can theme
them for light and dark modes.

## Acceptance Criteria

| ID           | Criteria                                             | Verification |
| ------------ | ---------------------------------------------------- | ------------ |
| NFR-004-AC-1 | Component source contains no hardcoded color values  | Inspection   |
| NFR-004-AC-2 | Components expose stable CSS class names for theming | Inspection   |

> Backsync note: spec.md prose claims `ix-themes` token usage and ApplicationDetailPage
> parity. The shipped components use plain CSS class names and minimal inline
> layout styles; they do not import `ix-themes`. See review finding BSF-1.
