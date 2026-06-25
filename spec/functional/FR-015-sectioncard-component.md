---
id: FR-015
title: 'SectionCard component'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-008'
    type: 'implements'
---

# FR-015: SectionCard component

## Description

`<SectionCard heading icon? render? className? style?>` SHALL render the named
section as a themed card (header with optional icon + heading, content body). The
content is produced by the optional `render(content)` callback; with no callback,
the content is rendered as raw text in a `<pre>` block. A missing section renders
`null`. The card container uses CSS class names (`quire-section-card*`) for
theming; it does not import `markdown-editor` or `ix-themes` (see review BSF-1).

## Inputs

- `heading: string`, `icon?`, `render?: (content: string) => ReactNode`, `className?`, `style?`

## Outputs

- A themed card element, or `null`

## Acceptance Criteria

| ID          | Criteria                                           | Verification                           |
| ----------- | -------------------------------------------------- | -------------------------------------- |
| FR-015-AC-1 | With no `render`, content displays as raw text     | Test (tests/react/components.test.tsx) |
| FR-015-AC-2 | A custom `render` receives the raw section content | Test (tests/react/components.test.tsx) |
| FR-015-AC-3 | A missing section renders `null`                   | Test (tests/react/components.test.tsx) |
| FR-015-AC-4 | The `icon` is shown in the card header             | Test (tests/react/components.test.tsx) |

## Dependencies

- **Upstream**: [US-008](../usecase/US-008-render-section-cards-automatically.md)
- **Resilience**: [FR-028](./FR-028-render-error-boundaries.md)
- **Quality**: [NFR-004](../non-functional/NFR-004-theme-integration.md)
