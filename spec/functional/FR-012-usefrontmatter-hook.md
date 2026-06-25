---
id: FR-012
title: 'useFrontmatter hook'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-007'
    type: 'implements'
---

# FR-012: useFrontmatter hook

## Description

`useFrontmatter<T>()` SHALL return the document's parsed `frontmatter` (already
present on the `QuireDocument`) typed as `T`, or `null` when no frontmatter was
parsed.

## Inputs

- (none; reads context)

## Outputs

- `T | null`

## Acceptance Criteria

| ID          | Criteria                                    | Verification                      |
| ----------- | ------------------------------------------- | --------------------------------- |
| FR-012-AC-1 | Returns the parsed frontmatter object       | Test (tests/react/hooks.test.tsx) |
| FR-012-AC-2 | Returns `null` when there is no frontmatter | Test (tests/react/hooks.test.tsx) |

## Dependencies

- **Upstream**: [US-007](../usecase/US-007-extract-frontmatter.md)
- **Calls**: [FR-005](./FR-005-frontmatter-extraction.md)
