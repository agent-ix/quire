---
id: FR-006
title: 'Diagram extraction with type tags'
type: FR
relationships:
  - target: 'ix://agent-ix/quire/US-010'
    type: 'implements'
  - target: 'ix://agent-ix/quire/US-014'
    type: 'implements'
---

# FR-006: Diagram extraction with type tags

## Description

`extractDiagrams(doc, opts?)` SHALL extract fenced code blocks and return
`DiagramBlock[]` with `index` (0-based), `language` (fence info string), `source`
(block body), `section` (heading of the containing section, or `null` in
preamble), and `tag`. The `tag` is the value of an in-block `%% @type: <value>`
annotation, or `null` if absent; tag values are NOT validated. An optional
`opts.language` filters to one fence language. An unclosed fenced block is
emitted with the remainder as its source.

> Implementation note: this REPLACES the spec.md prose describing a `classify`
> option and keyword-based `classification`. The shipped engine reads an
> explicit `tag`; it does not classify by keyword. See review finding BSF-4.

## Inputs

- `doc: QuireDocument`, `opts?: { language?: string }`

## Outputs

- `DiagramBlock[]` — `{ index, language, source, section, tag }`

## Acceptance Criteria

| ID          | Criteria                                                            | Verification                    |
| ----------- | ------------------------------------------------------------------- | ------------------------------- |
| FR-006-AC-1 | A ` ```mermaid ` block yields `language` "mermaid" and its `source` | Test (tests/core/query.test.ts) |
| FR-006-AC-2 | `%% @type: <value>` annotation is parsed into the `tag` field       | Test (tests/core/query.test.ts) |
| FR-006-AC-3 | `tag` is `null` when no annotation is present                       | Test (tests/core/query.test.ts) |
| FR-006-AC-4 | A diagram inside `## Architecture` has `section` "Architecture"     | Test (tests/core/query.test.ts) |
| FR-006-AC-5 | `opts.language` filters blocks to that fence language               | Test (tests/core/query.test.ts) |

## Dependencies

- **Upstream**: [US-010](../usecase/US-010-extract-diagrams.md), [US-014](../usecase/US-014-classify-mermaid-diagrams.md)
- **Related**: [FR-020](./FR-020-find-diagram-by-tag.md)
