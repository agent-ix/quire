---
id: FR-005
title: 'Frontmatter extraction'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-007'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-015'
    type: 'implements'
---

# FR-005: Frontmatter extraction

## Description

`extractFrontmatter(md)` SHALL parse YAML frontmatter delimited by leading `---`
markers and return `{ frontmatter, body }`. The lightweight reader supports
`key: value` scalars, single-line arrays `[a, b, c]`, booleans, numbers, and
quoted strings. It does NOT support nested objects or multi-line strings. When
there is no opening `---`, no closing `---`, or the YAML is malformed (a line
without a colon), it SHALL return `{ frontmatter: null, body: <full input> }`
without throwing. It throws `TypeError` on `null`/`undefined` input.

## Inputs

- `md: string`

## Outputs

- `FrontmatterResult<T>` — `{ frontmatter: T | null, body: string }`

## Acceptance Criteria

| ID          | Criteria                                                              | Verification                          |
| ----------- | --------------------------------------------------------------------- | ------------------------------------- |
| FR-005-AC-1 | `---\nfoo: bar\n---\nbody` → `{ foo: "bar" }`, body "body"            | Test (tests/core/frontmatter.test.ts) |
| FR-005-AC-2 | No `---` markers → `null` frontmatter, body = full input              | Test (tests/core/frontmatter.test.ts) |
| FR-005-AC-3 | `standards_alignment: [iso-29148, ieee-828]` parses to a string array | Test (tests/core/frontmatter.test.ts) |
| FR-005-AC-4 | `related_standards: [cloudevents]` parses to `["cloudevents"]`        | Test (tests/core/frontmatter.test.ts) |
| FR-005-AC-5 | Booleans, numbers, and quoted strings are coerced to typed values     | Test (tests/core/frontmatter.test.ts) |
| FR-005-AC-6 | No closing `---` marker → `null` frontmatter, body = full input       | Test (tests/core/frontmatter.test.ts) |

## Dependencies

- **Upstream**: [US-007](../usecase/US-007-extract-frontmatter.md), [US-015](../usecase/US-015-resolve-standards-alignment.md)
- **Related**: [FR-027](./FR-027-error-handling-and-edge-cases.md) (malformed-YAML and null-input behavior)
