---
id: FR-004
title: 'Structured list extraction'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-004'
    type: 'implements'
---

# [FR-004] Structured list extraction

## Description

`parseBulletList(content, opts?)` SHALL extract bullet items (`-` or `*`
prefixed) and parse structured title/description patterns. The `bold-description`
pattern splits `**Title** — Description` (em/en dash or hyphen); `bold-colon`
splits `**Title**: Description`. For non-`plain` patterns, both bold patterns are
attempted as a fallback. Plain items keep the full text as `title` with empty
`description`. Lines not starting with a bullet are excluded. Throws `TypeError`
on `null`/`undefined`.

## Inputs

- `content: string`, `opts?: { pattern?: 'bold-description' | 'bold-colon' | 'plain' }`

## Outputs

- `ListItem[]` — `{ raw, title, description }`

## Acceptance Criteria

| ID          | Criteria                                                                 | Verification                    |
| ----------- | ------------------------------------------------------------------------ | ------------------------------- |
| FR-004-AC-1 | `- **Auth** — Token-based` → `title` "Auth", `description` "Token-based" | Test (tests/core/query.test.ts) |
| FR-004-AC-2 | `- **Auth**: Token-based` (colon) splits title/description               | Test (tests/core/query.test.ts) |
| FR-004-AC-3 | `- Simple item` → `title` full text, `description` empty                 | Test (tests/core/query.test.ts) |
| FR-004-AC-4 | Lines not starting with `-`/`*` are excluded                             | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-004](../usecase/US-004-extract-structured-lists.md)
