---
id: FR-009
title: 'useSection hook'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-005'
    type: 'implements'
---

# FR-009: useSection hook

## Description

`useSection(heading)` SHALL return `{ content, section, update }` for the named
section: `content` is the section's raw content or `null`; `section` is the
`QuireSection` or `null`; `update(newContent)` calls `updateSection()` and the
provider's `onChange` (no-op when no `onChange` is set). When called outside a
`<QuireProvider>`, it SHALL throw `QuireContextError` with a descriptive message.

## Inputs

- `heading: string`

## Outputs

- `UseSectionResult` — `{ content, section, update }`

## Acceptance Criteria

| ID          | Criteria                                                 | Verification                      |
| ----------- | -------------------------------------------------------- | --------------------------------- |
| FR-009-AC-1 | Returns content for a valid heading                      | Test (tests/react/hooks.test.tsx) |
| FR-009-AC-2 | Returns `null` content and section for a missing heading | Test (tests/react/hooks.test.tsx) |
| FR-009-AC-3 | `update()` calls `onChange` with the updated markdown    | Test (tests/react/hooks.test.tsx) |
| FR-009-AC-4 | Called outside a provider throws `QuireContextError`     | Test (tests/react/hooks.test.tsx) |

## Dependencies

- **Upstream**: [US-005](../usecase/US-005-react-context-for-document-state.md)
- **Calls**: [FR-002](./FR-002-section-query-by-heading.md), [FR-014](./FR-014-section-update-and-write-back.md)
