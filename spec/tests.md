---
id: tests
title: 'Quire Test Matrix'
type: test-matrix
---

# Quire Test Matrix

Status: ✅ Complete — every Acceptance Criterion maps to ≥ 1 Test Case. TCs are
grounded in the existing vitest suites under `tests/`. Where an AC has no
automated test today, it is marked ⚠️ and traced to a review finding.

## Traceability Summary

| Source                                  | Implemented by / Verified by                     |
| --------------------------------------- | ------------------------------------------------ |
| StR-001 Eliminate parsing duplication   | US-001..US-018 → FR-001..FR-024 → TC-001..TC-060 |
| StR-002 Structured document interaction | US-006 → FR-014 → TC-040..TC-043                 |

## Test Suites (files)

| File                            | Layer | Covers                                                 |
| ------------------------------- | ----- | ------------------------------------------------------ |
| tests/core/parser.test.ts       | L1    | FR-001, FR-027                                         |
| tests/core/frontmatter.test.ts  | L1    | FR-005, FR-027                                         |
| tests/core/query.test.ts        | L2    | FR-002, FR-003, FR-004, FR-006, FR-007, FR-019, FR-020 |
| tests/core/writeback.test.ts    | L1    | FR-014, NFR-002                                        |
| tests/react/hooks.test.tsx      | L3    | FR-008..FR-013                                         |
| tests/react/components.test.tsx | L3    | FR-015..FR-018, FR-028                                 |
| tests/react/extensions.test.tsx | L3    | FR-021, FR-022, FR-023, FR-024, FR-028                 |

## Test Cases

### Layer 1 — Parser (FR-001, FR-005, FR-027)

| TC     | Title                                    | Type       | Priority | Trace (AC)               | Status |
| ------ | ---------------------------------------- | ---------- | -------- | ------------------------ | ------ |
| TC-001 | Split `##` headings into named sections  | Functional | P1       | FR-001-AC-1, US-001-EX-1 | ✅     |
| TC-002 | Nested headings form a hierarchy         | Functional | P1       | FR-001-AC-2, US-001-EX-2 | ✅     |
| TC-003 | Preamble captured before first heading   | Functional | P1       | FR-001-AC-3              | ✅     |
| TC-004 | Numbered heading text preserved          | Functional | P2       | FR-001-AC-4              | ✅     |
| TC-005 | Headings inside fenced blocks not parsed | Edge       | P1       | FR-001-AC-5              | ✅     |
| TC-006 | Document with no headings → all preamble | Edge       | P2       | FR-001-AC-6              | ✅     |
| TC-007 | Empty string → empty document            | Boundary   | P1       | FR-027-AC-1, US-001-EX-3 | ✅     |
| TC-008 | Heading with empty content → `""`        | Edge       | P2       | FR-027-AC-4              | ✅     |
| TC-009 | Unclosed fenced block tolerated          | Error      | P2       | FR-027-AC-3              | ✅     |
| TC-010 | `null` input throws TypeError            | Error      | P1       | FR-027-AC-5              | ✅     |
| TC-011 | Extract `---` frontmatter to object      | Functional | P1       | FR-005-AC-1, US-007-EX-1 | ✅     |
| TC-012 | No markers → null frontmatter, full body | Boundary   | P1       | FR-005-AC-2, US-007-EX-2 | ✅     |
| TC-013 | Single-line array parsed                 | Functional | P2       | FR-005-AC-3              | ✅     |
| TC-014 | `related_standards` array parsed         | Functional | P2       | FR-005-AC-4              | ✅     |
| TC-015 | Boolean/number/quoted-string coercion    | Functional | P2       | FR-005-AC-5              | ✅     |
| TC-016 | No closing `---` → null frontmatter      | Error      | P2       | FR-005-AC-6              | ✅     |
| TC-017 | Malformed YAML → null, body preserved    | Error      | P1       | FR-027-AC-2, US-007-EX-3 | ✅     |

### Layer 2 — Query (FR-002, FR-003, FR-004, FR-006, FR-007, FR-019, FR-020)

| TC     | Title                                        | Type       | Priority | Trace (AC)               | Status |
| ------ | -------------------------------------------- | ---------- | -------- | ------------------------ | ------ |
| TC-018 | Heading lookup across numbering/level        | Functional | P1       | FR-002-AC-1, US-002-EX-1 | ✅     |
| TC-019 | Case-insensitive heading match               | Functional | P2       | FR-002-AC-2              | ✅     |
| TC-020 | Missing heading → null                       | Boundary   | P1       | FR-002-AC-3, US-002-EX-2 | ✅     |
| TC-021 | `sections({ level })` filter                 | Option     | P2       | FR-002-AC-4              | ✅     |
| TC-022 | Equality (not substring) after number strip  | Edge       | P1       | FR-002-AC-5, US-002-EX-3 | ✅     |
| TC-023 | Table headers + rows extracted               | Functional | P1       | FR-003-AC-1, US-003-EX-1 | ✅     |
| TC-024 | Separator rows excluded                      | Functional | P1       | FR-003-AC-2              | ✅     |
| TC-025 | Leading/trailing pipes stripped              | Functional | P2       | FR-003-AC-3              | ✅     |
| TC-026 | Cell whitespace trimmed                      | Functional | P2       | FR-003-AC-4              | ✅     |
| TC-027 | No table → empty result                      | Boundary   | P1       | FR-003-AC-5, US-003-EX-2 | ✅     |
| TC-028 | `parseTables()` returns all tables           | Option     | P2       | FR-003-AC-6, US-003-EX-3 | ✅     |
| TC-029 | Short rows padded / long rows truncated      | Edge       | P1       | FR-003-AC-7              | ✅     |
| TC-030 | `tableFromSection` empty for missing section | Boundary   | P2       | FR-003-AC-8              | ✅     |
| TC-031 | bold-description list split                  | Functional | P1       | FR-004-AC-1, US-004-EX-1 | ✅     |
| TC-032 | bold-colon list split                        | Option     | P2       | FR-004-AC-2              | ✅     |
| TC-033 | Plain item → full title, empty desc          | Boundary   | P2       | FR-004-AC-3, US-004-EX-2 | ✅     |
| TC-034 | Non-bullet lines excluded                    | Edge       | P2       | FR-004-AC-4              | ✅     |
| TC-035 | Mermaid block extracted with source          | Functional | P1       | FR-006-AC-1, US-010-EX-1 | ✅     |
| TC-036 | `%% @type:` parsed into `tag`                | Functional | P1       | FR-006-AC-2, US-014-EX-1 | ✅     |
| TC-037 | `tag` null when no annotation                | Boundary   | P2       | FR-006-AC-3              | ✅     |
| TC-038 | Diagram `section` association                | Functional | P2       | FR-006-AC-4, US-010-EX-2 | ✅     |
| TC-039 | `language` filter                            | Option     | P2       | FR-006-AC-5              | ✅     |
| TC-040 | `findDiagramByTag` returns first match       | Functional | P2       | FR-020-AC-1, US-014-EX-2 | ✅     |
| TC-041 | `findDiagramByTag` → null when none          | Boundary   | P2       | FR-020-AC-2              | ✅     |
| TC-042 | Search finds matching sections               | Functional | P1       | FR-007-AC-1              | ✅     |
| TC-043 | Search is case-insensitive                   | Functional | P2       | FR-007-AC-2              | ✅     |
| TC-044 | Search includes line numbers                 | Functional | P2       | FR-007-AC-3              | ✅     |
| TC-045 | `(handled by X)` delegation parsed           | Functional | P1       | FR-019-AC-1, US-012-EX-1 | ✅     |
| TC-046 | `(delegated to X)` delegation parsed         | Option     | P2       | FR-019-AC-2              | ✅     |
| TC-047 | No annotation → undefined delegation         | Boundary   | P2       | FR-019-AC-3, US-012-EX-2 | ✅     |

### Layer 1 — Write-back (FR-014, NFR-002)

| TC     | Title                           | Type       | Priority | Trace (AC)                             | Status |
| ------ | ------------------------------- | ---------- | -------- | -------------------------------------- | ------ |
| TC-048 | Target section content replaced | Functional | P1       | FR-014-AC-1, US-006-EX-1, NFR-002-AC-1 | ✅     |
| TC-049 | Other sections unchanged        | Functional | P1       | FR-014-AC-2, US-006-EX-2, NFR-002-AC-1 | ✅     |
| TC-050 | Frontmatter preserved           | Functional | P1       | FR-014-AC-3, NFR-002-AC-2              | ✅     |
| TC-051 | Missing heading throws Error    | Error      | P1       | FR-014-AC-4                            | ✅     |

### Layer 3 — Hooks (FR-008..FR-013)

| TC     | Title                                          | Type       | Priority | Trace (AC)               | Status |
| ------ | ---------------------------------------------- | ---------- | -------- | ------------------------ | ------ |
| TC-052 | Provider parses + exposes via hooks            | Functional | P1       | FR-008-AC-1, US-005-EX-1 | ✅     |
| TC-053 | Re-parse on content change                     | State      | P1       | FR-008-AC-2, US-005-EX-2 | ✅     |
| TC-054 | `useSection` content for valid heading         | Functional | P1       | FR-009-AC-1              | ✅     |
| TC-055 | `useSection` null for missing heading          | Boundary   | P1       | FR-009-AC-2              | ✅     |
| TC-056 | `update()` triggers `onChange`                 | State      | P1       | FR-009-AC-3, FR-008-AC-3 | ✅     |
| TC-057 | Hook outside provider throws QuireContextError | Error      | P1       | FR-009-AC-4, US-005-EX-3 | ✅     |
| TC-058 | `useTable` returns section table               | Functional | P1       | FR-010-AC-1              | ✅     |
| TC-059 | `useTable` empty for missing section           | Boundary   | P2       | FR-010-AC-2              | ✅     |
| TC-060 | `useList` returns parsed items                 | Functional | P1       | FR-011-AC-1, FR-011-AC-2 | ✅     |
| TC-061 | `useFrontmatter` returns object                | Functional | P1       | FR-012-AC-1              | ✅     |
| TC-062 | `useFrontmatter` null when absent              | Boundary   | P2       | FR-012-AC-2              | ✅     |
| TC-063 | `useDiagram` returns all diagrams              | Functional | P1       | FR-013-AC-1              | ✅     |
| TC-064 | `useDiagram` filters by heading                | Functional | P2       | FR-013-AC-2              | ✅     |

### Layer 3 — Components (FR-015..FR-018, FR-028)

| TC     | Title                                     | Type       | Priority | Trace (AC)               | Status             |
| ------ | ----------------------------------------- | ---------- | -------- | ------------------------ | ------------------ |
| TC-065 | SectionCard raw-text fallback             | Functional | P1       | FR-015-AC-1, US-008-EX-1 | ✅                 |
| TC-066 | SectionCard custom render                 | Option     | P2       | FR-015-AC-2              | ✅                 |
| TC-067 | SectionCard null for missing section      | Boundary   | P2       | FR-015-AC-3              | ✅                 |
| TC-068 | SectionCard renders icon                  | Functional | P2       | FR-015-AC-4              | ✅                 |
| TC-069 | SectionCard render throw → fallback + log | Error      | P1       | FR-028-AC-1, US-008-EX-3 | ✅                 |
| TC-070 | SectionTable renders table                | Functional | P1       | FR-016-AC-1, US-011-EX-1 | ✅                 |
| TC-071 | SectionTable null for empty table         | Boundary   | P2       | FR-016-AC-2              | ✅                 |
| TC-072 | SectionTable cell renderer applied        | Option     | P2       | FR-016-AC-3, US-011-EX-2 | ✅                 |
| TC-073 | SectionTable cell throw → raw text        | Error      | P1       | FR-016-AC-4, FR-028-AC-2 | ✅                 |
| TC-074 | SectionList renders items                 | Functional | P1       | FR-017-AC-1              | ✅                 |
| TC-075 | SectionList item icon                     | Functional | P2       | FR-017-AC-2              | ✅                 |
| TC-076 | SectionList null for missing section      | Boundary   | P2       | FR-017-AC-3              | ✅                 |
| TC-077 | SectionList grid layout                   | Option     | P3       | FR-017-AC-4              | ⚠️ inspection-only |
| TC-078 | AutoSections renders all sections         | Functional | P1       | FR-018-AC-1, US-008-EX-2 | ✅                 |
| TC-079 | AutoSections uses matching renderer       | Option     | P1       | FR-018-AC-2              | ✅                 |
| TC-080 | AutoSections fallback to SectionCard      | Boundary   | P2       | FR-018-AC-3              | ✅                 |
| TC-081 | AutoSections excludes headings            | Option     | P2       | FR-018-AC-4              | ✅                 |
| TC-082 | AutoSections renderer throw → fallback    | Error      | P1       | FR-028-AC-3              | ✅                 |

### Layer 3 — Extensions (FR-021..FR-024, FR-028)

| TC     | Title                                          | Type       | Priority | Trace (AC)                            | Status |
| ------ | ---------------------------------------------- | ---------- | -------- | ------------------------------------- | ------ |
| TC-083 | Standards resolved (id/name populated)         | Functional | P2       | FR-021-AC-1, US-015-EX-2              | ✅     |
| TC-084 | Unresolvable code → resolved=false             | Boundary   | P2       | FR-021-AC-2                           | ✅     |
| TC-085 | Match by code/id/name                          | Option     | P3       | FR-021-AC-3                           | ✅     |
| TC-086 | No standards_alignment → []                    | Boundary   | P2       | FR-021-AC-4, US-015-EX-1              | ✅     |
| TC-087 | parseADR extracts Context/Decision/Rationale   | Functional | P2       | FR-022-AC-1, US-017-EX-1              | ✅     |
| TC-088 | parseADR default status "Accepted"             | Boundary   | P2       | FR-022-AC-2, US-017-EX-2              | ✅     |
| TC-089 | parseADR empty content → null                  | Boundary   | P2       | FR-022-AC-3                           | ✅     |
| TC-090 | groupDependencies classifies by filter         | Functional | P2       | FR-023-AC-1, US-013-EX-1              | ✅     |
| TC-091 | groupDependencies filter throw → exclude + log | Error      | P1       | FR-023-AC-2, FR-028-AC-4, US-013-EX-2 | ✅     |
| TC-092 | extractFRDiagrams returns sources              | Functional | P3       | FR-024-AC-1, US-018-EX-1              | ✅     |
| TC-093 | extractFRDiagrams carries frId/frTitle         | Functional | P3       | FR-024-AC-2                           | ✅     |

### Non-Functional

| TC     | Title                                       | Type            | Priority | Trace (AC)                 | Status                     |
| ------ | ------------------------------------------- | --------------- | -------- | -------------------------- | -------------------------- |
| TC-094 | Write-back preserves other sections         | Reliability     | P1       | NFR-002-AC-1               | ✅                         |
| TC-095 | Write-back preserves frontmatter            | Reliability     | P1       | NFR-002-AC-2               | ✅                         |
| TC-096 | Core modules have zero React imports        | Portability     | P2       | NFR-003-AC-1               | ⚠️ inspection (grep)       |
| TC-097 | `@agent-ix/quire/core` import without React | Portability     | P2       | NFR-003-AC-2               | ⚠️ inspection              |
| TC-098 | Bundle < 50KB gzipped                       | Portability     | P3       | NFR-003-AC-3               | ⚠️ build-measured          |
| TC-099 | No hardcoded colors in components           | Usability       | P2       | NFR-004-AC-1               | ⚠️ inspection              |
| TC-100 | Coverage ≥ 90% L1+2 / ≥ 80% L3              | Maintainability | P1       | NFR-005-AC-1, NFR-005-AC-2 | ✅ (vitest --coverage)     |
| TC-101 | `parseDocument` < 10ms for 500 sections     | Performance     | P3       | NFR-001-AC-1, NFR-001-AC-2 | ❌ no perf suite (BSF-7)   |
| TC-102 | Round-trip corpus fidelity                  | Reliability     | P3       | NFR-002-AC-3               | ❌ no corpus suite (BSF-7) |

## Six-Rules Coverage Notes

1. **Coverage** — every FR/NFR AC traces to ≥ 1 TC above.
2. **Option permutation** — list patterns (TC-031/032/033), table single vs all (TC-028), renderer presence/absence (TC-066/072/079), diagram language filter (TC-039), standards match dimensions (TC-085).
3. **Constraint boundary** — empty/missing inputs (TC-007/020/027/030/055/059/062/067/071/076/086/089).
4. **Error path** — null input (TC-010), malformed YAML (TC-017), missing-section throw (TC-051), context error (TC-057), renderer/filter throws (TC-069/073/082/091).
5. **State transition** — provider re-parse on content change and mutation→onChange (TC-053/056).
6. **Edge case** — fenced-block headings (TC-005), unclosed fence (TC-009), row padding/truncation (TC-029), exact-vs-substring matching (TC-022).

## Gaps (tracked in review.md)

- TC-101, TC-102 (NFR-001 perf, NFR-002 corpus) have no automated suite yet → BSF-7.
- TC-096..TC-099 are inspection/build-time, not unit tests.
