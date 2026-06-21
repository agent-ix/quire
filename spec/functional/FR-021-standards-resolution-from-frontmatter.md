---
id: FR-021
title: 'Standards resolution from frontmatter'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-015'
    type: 'implements'
---

# [FR-021] Standards resolution from frontmatter

## Description

`useStandardsAlignment(standards)` SHALL read `standards_alignment` from
frontmatter and resolve each code against the supplied `StandardRecord[]`,
matching (case-insensitive) by `code`, `id`, or a slugified `name`. Each result
is `{ code, id, name, resolved }`; resolved entries carry `id`/`name`, unresolved
entries keep `resolved: false` with the raw `code` preserved. With no codes it
returns `[]`.

## Inputs

- `standards: StandardRecord[]` (reads `standards_alignment` from frontmatter)

## Outputs

- `ResolvedStandard[]` — `{ code, id, name, resolved }`

## Acceptance Criteria

| ID          | Criteria                                                       | Verification                           |
| ----------- | -------------------------------------------------------------- | -------------------------------------- |
| FR-021-AC-1 | A code matching a standard resolves with `id`/`name` populated | Test (tests/react/extensions.test.tsx) |
| FR-021-AC-2 | An unresolvable code has `resolved: false`, `code` preserved   | Test (tests/react/extensions.test.tsx) |
| FR-021-AC-3 | Matching is by code, id, or name (case-insensitive)            | Test (tests/react/extensions.test.tsx) |
| FR-021-AC-4 | No `standards_alignment` returns `[]`                          | Test (tests/react/extensions.test.tsx) |

## Dependencies

- **Upstream**: [US-015](../usecase/US-015-resolve-standards-alignment.md)
- **Calls**: [FR-012](./FR-012-usefrontmatter-hook.md)
