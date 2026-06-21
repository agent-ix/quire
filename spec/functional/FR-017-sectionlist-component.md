---
id: FR-017
title: 'SectionList component'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-008'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-012'
    type: 'implements'
---

# [FR-017] SectionList component

## Description

`<SectionList heading pattern? layout? columns? itemIcon? className? style?>`
SHALL parse the named section's bullet list (default pattern `bold-description`)
and render its items. With `layout="grid"` it uses a CSS grid of `columns`;
otherwise a stack. Each item shows an optional `itemIcon`, the `title`, and (when
present) the `description`. A section with no list items renders `null`.

## Inputs

- `heading`, `pattern?`, `layout?: 'grid' | 'stack'`, `columns?`, `itemIcon?`, `className?`, `style?`

## Outputs

- A list/grid element, or `null`

## Acceptance Criteria

| ID          | Criteria                                   | Verification                           |
| ----------- | ------------------------------------------ | -------------------------------------- |
| FR-017-AC-1 | Renders parsed list items from the section | Test (tests/react/components.test.tsx) |
| FR-017-AC-2 | The `itemIcon` is rendered per item        | Test (tests/react/components.test.tsx) |
| FR-017-AC-3 | A section with no items renders `null`     | Test (tests/react/components.test.tsx) |
| FR-017-AC-4 | `layout="grid"` applies an N-column grid   | Inspection (gridTemplateColumns)       |

## Dependencies

- **Upstream**: [US-008](../usecase/US-008-render-section-cards-automatically.md), [US-012](../usecase/US-012-render-delegated-concerns.md)
- **Calls**: [FR-011](./FR-011-uselist-hook.md)
