---
id: FR-008
title: 'QuireProvider React context'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-005'
    type: 'implements'
---

# [FR-008] QuireProvider React context

## Description

`<QuireProvider content onChange? children>` SHALL parse `content` via
`parseDocument()` (memoized on `content`) and expose the resulting
`QuireDocument` plus the optional `onChange` callback through React context.
Identical `content` SHALL NOT trigger a re-parse; changed `content` re-parses and
all hooks re-derive. The provider does not call `onChange` itself; section
mutation helpers (e.g. `useSection().update`) do.

## Inputs

- `content: string`, `onChange?: (markdown: string) => void`, `children`

## Outputs

- React context value `{ document, onChange }` consumed by hooks

## Acceptance Criteria

| ID          | Criteria                                                           | Verification                      |
| ----------- | ------------------------------------------------------------------ | --------------------------------- |
| FR-008-AC-1 | `content` is parsed and available via hooks                        | Test (tests/react/hooks.test.tsx) |
| FR-008-AC-2 | Changing `content` re-parses and hooks re-derive                   | Test (tests/react/hooks.test.tsx) |
| FR-008-AC-3 | `useSection().update` triggers `onChange` with serialized markdown | Test (tests/react/hooks.test.tsx) |
| FR-008-AC-4 | Parsing is memoized on `content`                                   | Inspection (useMemo on content)   |

## Dependencies

- **Upstream**: [US-005](../usecase/US-005-react-context-for-document-state.md)
- **Calls**: [FR-001](./FR-001-parse-document-into-section-tree.md), [FR-014](./FR-014-section-update-and-write-back.md)
