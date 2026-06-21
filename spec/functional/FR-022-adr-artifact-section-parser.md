---
id: FR-022
title: 'ADR artifact section parser'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-017'
    type: 'implements'
---

# [FR-022] ADR artifact section parser

## Description

`parseADRFromContent(content)` SHALL parse an Architecture Decision Record's
markdown into `{ id, title, context, decision, rationale, status, diagrams }`.
`context`, `decision`, and `rationale` are extracted from their `##`/`###`/`####`
sub-sections (each `null` when absent). `status` is taken from a `Status: <word>`
match and defaults to `"Accepted"` when absent. Embedded mermaid blocks are
collected into `diagrams`. Empty/whitespace content returns `null`. `id` and
`title` are returned empty (the caller supplies them).

> Implementation note: the shipped signature is `parseADRFromContent(content)`,
> NOT the spec.md `parseADR(content, meta)`; fields are nullable and there is a
> `diagrams` field (no `raw` field). See review finding BSF-5.

## Inputs

- `content: string`

## Outputs

- `ParsedADR | null` — `{ id, title, context, decision, rationale, status, diagrams }`

## Acceptance Criteria

| ID          | Criteria                                                         | Verification                           |
| ----------- | ---------------------------------------------------------------- | -------------------------------------- |
| FR-022-AC-1 | `## Context`/`## Decision`/`## Rationale` sections are extracted | Test (tests/react/extensions.test.tsx) |
| FR-022-AC-2 | A missing Status section defaults to "Accepted"                  | Test (tests/react/extensions.test.tsx) |
| FR-022-AC-3 | Empty/whitespace content returns `null`                          | Test (tests/react/extensions.test.tsx) |

## Dependencies

- **Upstream**: [US-017](../usecase/US-017-parse-adr-artifacts.md)
