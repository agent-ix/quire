---
id: REV-001
title: 'quire Spec Review'
type: Review
---

# quire Spec Review

Review of the requirements artifacts authored for `@agent-ix/quire` against the
master spec (`spec.md`) and, critically, against the **actual source** in `src/`.
All requirements below were verified against the code and the 100-test vitest
suite (all passing as of this review).

## Scope Reviewed

- 2 stakeholder requirements (StR-001, StR-002)
- 17 user stories (US-001..008, US-010..018; US-009 intentionally absent, matching spec.md)
- 26 functional requirements (FR-001..024, FR-027, FR-028)
- 5 non-functional requirements (NFR-001..005)
- Test matrix (`tests.md`, TC-001..TC-102)

## Verdict

Artifacts are internally consistent (ID formats valid, FR↔US↔TC links resolve,
every AC traces to ≥1 TC). The FRs were written to match the **code as it
actually behaves**, which diverges from spec.md prose in several places. Those
divergences are recorded below as backsync findings (BSF) for `spec.md`, not as
defects in the authored FRs.

## component_type Verdict

**CONFIRMED CORRECT.** `spec.md` declares `component_type: typescript-react-lib`.
This repo (`/home/peter/dev/quire`, package `@agent-ix/quire`) is genuinely a
TypeScript + React library: `src/core/*` (pure TS parser/query/writeback, zero
React imports — verified by grep, satisfying NFR-003-AC-1) plus `src/react/*`
(QuireProvider, hooks, and `.tsx` components depending on `react`/`react-dom` as
peer deps). It is NOT the Rust `quire-rs` markdown/spec engine — that is a
separate, identically-named project. No correction needed here; flagged only
because the two "quire" projects are easy to conflate.

## Backsync Findings (spec.md ↔ code)

These are places where `spec.md` prose describes behavior the shipped code does
NOT implement. The authored FRs follow the code; spec.md should be updated.

- **BSF-1 (High) — "markdown-editor fallback" / "ix-themes tokens" not real.**
  spec.md §1.3 and FR-015/016/018 repeatedly state that sections without a
  custom renderer fall back to `markdown-editor` in read-only mode, and that
  components use `ix-themes` tokens (NFR-004, frontmatter `relationships` list
  both as `requires`). The code does neither: the fallback renders raw text in a
  `<pre>` block, and components use plain CSS class names (`quire-section-card`,
  …) with minimal inline layout styles. `package.json` has **zero runtime
  dependencies** — no `markdown-editor`, no `ix-themes`. The frontmatter
  `requires` relationships to `markdown-editor`, `spec-editor-ui-core`, and
  `ix-themes` are aspirational, not actual. Recommend: update spec.md prose +
  NFR-004 + frontmatter relationships to reflect the consumer-supplied theming
  model, OR implement the integrations.

- **BSF-2 (Medium) — method-badge / backtick logic lives in the consumer.**
  US-011/FR-016 prose ("GET=green, POST=blue…", "backticks stripped") describes
  behavior Quire does not own. `SectionTable` only supplies parsed rows + a
  `cellRenderers` hook; color mapping and backtick stripping are the consumer's.
  Authored US-011/FR-016 state this explicitly.

- **BSF-3 (Medium) — no `<GroupedDependencies>` component.**
  spec.md FR-023 describes a rendering component with `icon`, `onNavigate`,
  count badges, and "None" empty state. The code ships `groupDependencies()` +
  `useGroupedDependencies()` (classification only) — no React component, no
  icons/navigation. Authored FR-023 documents the real surface.

- **BSF-4 (Medium) — diagram "classification" is actually explicit tagging.**
  spec.md FR-006/FR-020 describe keyword-based classification (`deployment|k8s|…`
  → "deployment", first → "logical") and a `classifyDiagrams()` function.
  Neither exists. The code reads an explicit `%% @type: <value>` annotation into
  `DiagramBlock.tag` and provides `findDiagramByTag()`. Authored FR-006/FR-020
  and US-014 follow the code; recommend rewriting spec.md FR-006/FR-020 and the
  `classification` field on `DiagramBlock`.

- **BSF-5 (Low) — ADR parser signature differs.**
  spec.md FR-022 specifies `parseADR(content, meta)` returning non-null fields +
  a `raw` field. The code ships `parseADRFromContent(content)` returning nullable
  `context`/`decision`/`rationale`, a `diagrams` array, and empty `id`/`title`
  (caller supplies). Authored FR-022 matches the code.

- **BSF-6 (Low) — FR numbering gaps and the extra function.**
  spec.md's FR list skips FR-024..026 and never assigns an ID to the shipped
  `extractFRDiagrams` function (it's only mentioned under US-018). Authored
  FR-024 formalizes it. spec.md's interface for `QuireDocument` (FR-001) also
  omits the `frontmatter` field that the code actually returns; authored FR-001
  includes it.

- **BSF-7 (Medium) — NFR-001/NFR-002-AC-3 have no automated suite.**
  No performance benchmark exists for NFR-001 (<10ms/500 sections, <1ms
  frontmatter), and no multi-document corpus fidelity suite exists for
  NFR-002-AC-3. Round-trip AC-1/AC-2 ARE covered by `writeback.test.ts`. TC-101
  and TC-102 are marked ❌ in the matrix pending these suites.

## Coverage / Six-Rules Check

- **Coverage** — ✅ every FR/NFR AC maps to ≥1 TC (`tests.md`). The 100-test
  vitest suite passes; AC IDs are embedded in the test `describe`/`it` names,
  giving direct AC→test traceability.
- **Option permutation** — ✅ (list patterns, table single/all, renderer
  presence, language filter, standards match dimensions).
- **Constraint boundary** — ✅ (empty/missing inputs across parser, query, hooks,
  components).
- **Error path** — ✅ (null input, malformed YAML, missing-section throw, context
  error, resilient render/filter throws).
- **State transition** — ✅ (provider re-parse on content change; mutation→onChange).
- **Edge case** — ✅ (fenced-block headings, unclosed fence, row padding/truncation,
  exact-vs-substring matching).

## Quality Notes

- ID formats valid and sequential (US/FR/NFR/StR/TC, 3-digit; ACs `{PARENT}-AC-N`).
- No duplicate IDs.
- Internal links use relative paths (ADR-0007); cross-repo refs use `ix://`.
- Vague spec.md adjectives ("look great", "scannable") were translated into
  measurable, code-grounded ACs in the authored FRs.

## Gate

Artifacts accepted as a faithful, code-verified baseline. Recommended follow-up:
land the BSF-1..BSF-7 corrections into `spec.md` (or implement the missing
integrations), and add the NFR-001/NFR-002-AC-3 suites (BSF-7).
