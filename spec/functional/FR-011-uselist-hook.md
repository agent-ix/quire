---
id: FR-011
title: 'useList hook'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-004'
    type: 'implements'
---

# FR-011: useList hook

## Description

`useList(heading, opts?)` SHALL return the parsed `ListItem[]` from the named
section using `parseBulletList`, or `[]` when the section is missing. The
optional `pattern` is passed through to `parseBulletList`.

## Inputs

- `heading: string`, `opts?: { pattern?: ListPattern }`

## Outputs

- `ListItem[]`

## Acceptance Criteria

| ID          | Criteria                                             | Verification                      |
| ----------- | ---------------------------------------------------- | --------------------------------- |
| FR-011-AC-1 | Returns parsed bullet items from the named section   | Test (tests/react/hooks.test.tsx) |
| FR-011-AC-2 | `pattern` is honored for title/description splitting | Test (tests/react/hooks.test.tsx) |

## Dependencies

- **Upstream**: [US-004](../usecase/US-004-extract-structured-lists.md)
- **Calls**: [FR-004](./FR-004-structured-list-extraction.md)
