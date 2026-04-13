---
artifact_type: master-requirements
name: quire
org: agent-ix
component_type: typescript-react-lib
tags:
  - markdown
  - parsing
  - react-context
  - document-graph
implementation_language: typescript
relationships:
  - target: 'ix://agent-ix/markdown-editor'
    type: 'requires'
    cardinality: '1:1'
    note: 'Content rendering and editing within section cards (read-only or editable mode)'
  - target: 'ix://agent-ix/spec-editor-ui-core'
    type: 'requires'
    cardinality: '1:1'
  - target: 'ix://agent-ix/ix-themes'
    type: 'requires'
    cardinality: '1:1'

standards_alignment:
  - iso-iec-ieee-29148
---

# Master Requirements Specification

## Quire — Structured Document Interaction Library

---

## 1. Purpose

This document defines the scope, intent, and requirements for **Quire** (`@agent-ix/quire`), a TypeScript React library that provides structured interaction with markdown documents.

Quire takes raw markdown content and enables:

- **Parsing** into a structured section tree and typed objects
- **Querying** sections, tables, lists, and diagrams within that structure
- **Rich rendering** — parsed objects rendered as custom React components (badges, icons, interactive tables), with `markdown-editor` as the fallback for sections without custom renderers
- **Write-back** — modified sections serialized back to markdown
- **Graph traversal** across related documents and business objects

Quire is the complement to `typesetter` (which handles rich text rendering/editing). Where typesetter operates at the inline/block level, Quire operates at the **document structure** level — sections, headings, frontmatter, and cross-document relationships.

### 1.1 Problem Statement

Multiple views in the spec-editor-ui ecosystem (ApplicationDetailPage, StandardDetail, ADR views) independently implement the same patterns:

- Parse markdown by `##` headings into sections
- Extract tables, bullet lists, and mermaid diagrams from sections
- Render sections as themed cards with icons
- Query across child documents for aggregated views (all APIs, all domains)

This results in ~200+ lines of duplicated parsing logic per view, inconsistent parsing behavior, and no reusable write-back capability.

### 1.2 Solution

A single library that provides:

1. A **pure TypeScript parsing/query API** (no React dependency) for Layer 1+2
2. A **React context and hooks API** for Layer 3
3. **Pre-built section renderer components** for Layer 3
4. A **graph query provider** for Layer 4

### 1.3 Dual Rendering Model

Quire provides two rendering modes for section content:

1. **Parsed/rich rendering** (primary) — Markdown is parsed into **typed objects** (e.g., `{ method, endpoint, description }` for API tables, `{ title, description }` for feature lists, `{ role, capabilities, restrictions }` for security models). These objects are rendered with custom React components featuring styled badges, status icons, colored pills, clickable rows, and interactive elements. This is the core value — it's what makes ApplicationDetailPage look great.

2. **Markdown fallback** (default) — For sections where no custom renderer is defined, content is displayed via `markdown-editor` in read-only mode. This ensures every section is always renderable without requiring a custom component.

Consumers can mix both modes within a single document view — some sections get rich rendering, others fall through to markdown display.

---

## 2. Scope

### 2.1 In Scope

- **Markdown Parsing** — splitting markdown documents by heading hierarchy into a section tree
- **Frontmatter Extraction** — parsing YAML frontmatter into typed objects
- **Section Querying** — accessing sections by heading, level, or content pattern
- **Table Parsing** — extracting markdown tables into typed row arrays
- **List Parsing** — extracting bullet lists with structured patterns (bold title + description)
- **Diagram Extraction** — extracting mermaid and other fenced code blocks
- **React Context** — `QuireProvider` holding parsed document state
- **React Hooks** — `useSection()`, `useTable()`, `useList()`, `useFrontmatter()`, `useDiagram()`
- **Parsed Rich Rendering** — section content parsed into typed objects and rendered as custom React components (badges, icons, interactive tables, styled lists)
- **Markdown Fallback** — sections without custom renderers display via `markdown-editor` (read-only or editable)
- **Section Layout** — themed card/grid wrapper components for structural layout
- **Write-back** — serializing modified sections back to markdown
- **Graph Provider** — `QuireGraphProvider` for querying across multiple related documents
- **Graph Queries** — filtering business objects and artifacts by type across child documents

### 2.2 Out of Scope

- Inline rich text editing within a section (handled by `markdown-editor`)
- Markdown-to-HTML rendering (handled by `typesetter`)
- API client logic for fetching documents (handled by `spec-editor-ui-core`)
- Application-specific business logic (e.g., status badges, GitHub links)
- Block-level editor (handled by `spec-editor`)

---

## 3. System Overview

### 3.1 Architecture

```
┌─────────────────────────────────────────────────┐
│                  Consumer Views                  │
│  (ApplicationDetailPage, StandardDetail, etc.)   │
├─────────────────────────────────────────────────┤
│              Layer 4: Graph Query                │
│  QuireGraphProvider, useGraphQuery, GraphTable   │
├─────────────────────────────────────────────────┤
│       Layer 3: React Context + Rendering         │
│  QuireProvider, SectionCard, SectionTable,       │
│  SectionList, AutoSections                       │
│  Parsed → rich React components (primary)        │
│  Unparsed → markdown-editor fallback             │
├─────────────────────────────────────────────────┤
│            Layer 2: Query API                    │
│  sections(), section(), tables(), lists(),       │
│  diagrams(), search(), frontmatter()             │
├─────────────────────────────────────────────────┤
│            Layer 1: Parser                       │
│  parseDocument(), parseSections(),               │
│  parseTable(), parseBulletList(),                │
│  extractFrontmatter(), extractDiagrams()         │
├─────────────────────────────────────────────────┤
│           Raw Markdown Content                   │
└─────────────────────────────────────────────────┘
```

### 3.2 Intended Users

- **View developers** building detail pages in spec-editor-ui
- **Agent developers** needing structured access to spec content
- **Component authors** building reusable document-based UI

---

## 4. Stakeholder Requirements

### StR-001: Eliminate Parsing Duplication

**Statement**: The ecosystem SHALL have a single, reusable library for parsing markdown documents into structured sections, replacing all inline parsing logic in consumer views.

**Rationale**: Multiple views independently re-implement the same `getSectionContent()`, `parseTableFromSection()`, and bullet-list parsing patterns. This duplication causes inconsistent behavior and increases maintenance burden.

**Success Indicators**: ApplicationDetailPage and StandardDetail both consume Quire instead of inline parsing logic.

---

### StR-002: Structured Document Interaction

**Statement**: Developers SHALL be able to read from and write back to markdown documents at the section level without losing content fidelity.

**Rationale**: The spec editor UI needs to support editing individual sections of a spec while preserving the overall document structure, frontmatter, and content in non-edited sections.

**Success Indicators**: A section can be updated via the UI and the resulting markdown round-trips without loss.

---

### StR-003: Cross-Document Querying

**Statement**: Application-level views SHALL be able to query and aggregate content across multiple related documents (child specs, artifacts, business objects) using a consistent API.

**Rationale**: ApplicationDetailPage currently has ~100 lines of inline logic for fetching child repo artifacts, parsing their specs, and rendering aggregated views. This pattern will be needed in other views.

**Success Indicators**: The aggregated API/domain/event tables in ApplicationDetailPage are powered by Quire's graph query layer.

---

## 5. User Stories

### US-001: Parse a Spec into Sections

**Priority**: P1

As a **view developer**, I want to parse a markdown spec document into named sections, so that I can render each section as an independent card in the UI.

**Acceptance Criteria**:

- US-001-AC-1: Given a markdown string with `##` headings, when parsed, then each heading becomes a named section with its content.
- US-001-AC-2: Given nested headings (`##`, `###`, `####`), then sections form a hierarchy.
- US-001-AC-3: Given content before the first heading, then it is captured as a preamble section.
- US-001-AC-4: Given an empty string, then `preamble` is `null` and `sections` is `[]`.

---

### US-002: Query a Specific Section

**Priority**: P1

As a **view developer**, I want to access a specific section by heading name, so that I can render it in a targeted location without handling the full document.

**Acceptance Criteria**:

- US-002-AC-1: Given a parsed document, when I query `section("Purpose")`, then I receive the content under the `## Purpose` heading.
- US-002-AC-2: Given a heading that doesn't exist, then I receive `null`.
- US-002-AC-3: Given numbered headings (e.g., `## 2.1 In Scope`), the query `section("In Scope")` still matches.

---

### US-003: Extract Tables from Sections

**Priority**: P1

As a **view developer**, I want to extract markdown tables from a section as typed row arrays, so that I can render them in structured table components.

**Acceptance Criteria**:

- US-003-AC-1: Given a section containing a markdown table, when I call `table("API Endpoints")`, then I receive an array of row arrays with header-stripped data.
- US-003-AC-2: Given a section with no table, then I receive an empty array.
- US-003-AC-3: Given a section with multiple tables, then I receive all tables as an array.

---

### US-004: Extract Structured Lists

**Priority**: P1

As a **view developer**, I want to extract bullet lists with structured patterns (e.g., `**Title** — Description`), so that I can render them as feature cards.

**Acceptance Criteria**:

- US-004-AC-1: Given a bullet list with `**bold** — description` pattern, when extracted, then I receive `{ title, description }` items.
- US-004-AC-2: Given plain bullet items, then title is the full text and description is empty.

---

### US-005: React Context for Document State

**Priority**: P1

As a **view developer**, I want a React context that holds the parsed document state, so that child components can independently access sections without prop drilling.

**Acceptance Criteria**:

- US-005-AC-1: Given a `<QuireProvider content={md}>`, when a child calls `useSection("Purpose")`, then it receives the section content.
- US-005-AC-2: Given the content prop changes, then all hooks re-compute.
- US-005-AC-3: Given a hook called outside `QuireProvider`, then a descriptive error is thrown.

---

### US-006: Edit a Section and Write Back

**Priority**: P2

As a **view developer**, I want to update a specific section's content and get the full markdown back with the change applied, so that I can save it to the API.

**Acceptance Criteria**:

- US-006-AC-1: Given a document, when I call `updateSection("Purpose", newContent)`, then the returned markdown has the Purpose section replaced.
- US-006-AC-2: All other sections remain unchanged.
- US-006-AC-3: Frontmatter is preserved.

---

### US-007: Extract Frontmatter

**Priority**: P1

As a **view developer**, I want to extract YAML frontmatter as a typed object, so that I can access metadata like `standards_alignment`, `component_type`, and `relationships`.

**Acceptance Criteria**:

- US-007-AC-1: Given a document with `---` delimited frontmatter, when parsed, then frontmatter is available as a key-value object.
- US-007-AC-2: Given no frontmatter, then `null` is returned.
- US-007-AC-3: Given malformed YAML, then `null` is returned and body contains the full input.

---

### US-008: Render Section Cards Automatically

**Priority**: P2

As a **view developer**, I want pre-built section card components that render content with theming, so that I don't have to build card layouts for every view.

**Acceptance Criteria**:

- US-008-AC-1: Given a `<SectionCard heading="Purpose" icon={<BookOpen />} />` with no custom renderer, then it renders the section content in a themed card using `markdown-editor` in read-only mode.
- US-008-AC-2: Given a `<SectionTable heading="API Endpoints" columns={["Method", "Path", "Description"]} />`, then the markdown table is parsed into typed rows and rendered as a styled, interactive table component.
- US-008-AC-3: Given a `<SectionList heading="In Scope" pattern="bold-description" />`, then the bullet list is parsed into `{ title, description }` items and rendered as feature cards.
- US-008-AC-4: Given `editable` prop on any section component, then it uses `markdown-editor` in editable mode for write-back.
- US-008-AC-5: Given `<AutoSections />`, then all document sections render with rich components where custom renderers exist, and fall back to markdown-editor otherwise.
- US-008-AC-6: Given a custom renderer that throws an error, then the section falls back to `markdown-editor` read-only and the error is logged.

---

### US-009: Query Across Related Documents

**Priority**: P3

As a **view developer**, I want to query artifacts and business objects across multiple related documents (e.g., all APIs across child repos of an application), so that I can build aggregated views.

**Acceptance Criteria**:

- US-009-AC-1: Given a `<QuireGraphProvider documents={[...]} objects={aggregatedObjects}>`, when a child queries `type="api_endpoint"`, then it receives all API endpoints across all child repos.
- US-009-AC-2: Results can be grouped by source repo.
- US-009-AC-3: Results can be filtered by artifact type (FR, NFR, StR).

---

### US-010: Extract Diagrams

**Priority**: P1

As a **view developer**, I want to extract mermaid diagrams from the document, so that I can render them with the mermaid-renderer component.

**Acceptance Criteria**:

- US-010-AC-1: Given a document with mermaid fenced code blocks, when I call `diagrams()`, then I receive an array of diagram source strings.
- US-010-AC-2: Given a diagram within a specific section, `diagram("Architecture")` returns only that diagram.

---

### US-011: Render API Endpoint Tables with Method Badges

**Priority**: P2

As a **view developer**, I want to parse an "API Endpoints" markdown table into typed `{ method, endpoint, description }` rows and render them with color-coded HTTP method badges (GET=green, POST=blue, DELETE=red, PUT=amber, PATCH=purple), so that API surfaces are scannable at a glance.

**Acceptance Criteria**:

- US-011-AC-1: Given a markdown table under `## API Endpoints` with columns `Method | Endpoint | Description`, when parsed, then rows are extracted as typed objects.
- US-011-AC-2: Given a method value (GET, POST, etc.), then it renders with the correct color-coded badge.
- US-011-AC-3: Given endpoint values with backtick formatting, then backticks are stripped in the rendered output.

---

### US-012: Render Delegated Concerns with Delegation Annotations

**Priority**: P2

As a **view developer**, I want to parse an "Out of Scope" bullet list and extract delegation annotations like `(handled by auth-service)`, so that delegated concerns display with a visual link to the responsible component.

**Acceptance Criteria**:

- US-012-AC-1: Given a bullet item containing `(handled by X)` or `(delegated to X)`, when parsed, then I receive `{ item, delegation }` with the delegation target extracted.
- US-012-AC-2: Given a bullet item with no delegation annotation, then `delegation` is `undefined`.
- US-012-AC-3: Rendered items show an `→ X` suffix in muted text for delegated items.

---

### US-013: Render Grouped Dependencies by Type

**Priority**: P2

As a **view developer**, I want to classify and group child components by type (Backend, Libraries, UI) and render them in a multi-column layout with element icons, so that the component hierarchy of an application is immediately clear.

**Acceptance Criteria**:

- US-013-AC-1: Given an array of dependency summaries with `repo_type`, when grouped, then they are split into Backend, Libraries & SDKs, and UI columns.
- US-013-AC-2: Each component renders with its element icon (from `element_id`), name, type badge, and description.
- US-013-AC-3: Components are clickable and navigate to their detail page.

---

### US-014: Extract and Render Mermaid Architecture Diagrams

**Priority**: P2

As a **view developer**, I want to extract mermaid diagrams from the spec and classify them as "logical" vs "deployment" based on content keywords, so that I can render a toggled architecture view.

**Acceptance Criteria**:

- US-014-AC-1: Given a document with multiple mermaid fenced code blocks, when extracted, then the first diagram is classified as "logical" by default.
- US-014-AC-2: Given a mermaid block containing keywords like `deployment`, `k8s`, `pod`, `namespace`, then it is classified as "deployment".
- US-014-AC-3: Given exactly one diagram, then it serves as both logical and deployment.

---

### US-015: Resolve Standards Alignment from Frontmatter

**Priority**: P2

As a **view developer**, I want to extract `standards_alignment` codes from YAML frontmatter and resolve them against the standards database, so that I can render linked standard badges on the detail view.

**Acceptance Criteria**:

- US-015-AC-1: Given frontmatter containing `standards_alignment: [iso-iec-ieee-29148, ieee-828]`, when parsed, then I receive the code list.
- US-015-AC-2: Given a standards database, when resolved, then each code maps to its full name and ID for navigation.
- US-015-AC-3: Unresolved codes display with the raw code as fallback.

---

### US-016: Parse and Render Requirement Summary Tables

**Priority**: P2

As a **view developer**, I want to parse markdown tables under headings like "Functional Requirements", "Stakeholder Requirements", "User Stories", and "Non-Functional Requirements" into typed rows, so that I can render them as navigable requirement lists.

**Acceptance Criteria**:

- US-016-AC-1: Given a markdown table under `## Functional Requirements` with columns `ID | Title | Type`, when parsed, then I receive `{ id, title, type }` row objects.
- US-016-AC-2: Given a markdown table under `## Stakeholder Requirements` with columns `ID | Title`, when parsed, then I receive `{ id, title }` row objects.
- US-016-AC-3: Header rows and separator rows (`---`) are automatically stripped.

---

### US-017: Parse and Render ADR Artifacts

**Priority**: P3

As a **view developer**, I want to parse Architecture Decision Record artifacts by extracting Context, Decision, Rationale, and Status sections, so that I can render them as expandable decision cards.

**Acceptance Criteria**:

- US-017-AC-1: Given an ADR artifact with `## Context`, `## Decision`, `## Rationale`, `## Status` sections, when parsed, then each section's content is extracted.
- US-017-AC-2: Given a missing Status section, then it defaults to "Accepted".
- US-017-AC-3: ADR cards are collapsible with title + status badge visible when collapsed.

---

### US-018: Extract FR Process Diagrams from Child Artifacts

**Priority**: P3

As a **view developer**, I want to extract mermaid diagrams from FR (Functional Requirement) artifacts across child repos, so that I can render a "Process Diagrams" section showing workflow visualizations for key requirements.

**Acceptance Criteria**:

- US-018-AC-1: Given a list of FR artifacts, when scanned, then those containing mermaid blocks have their diagrams extracted alongside the FR ID and title.
- US-018-AC-2: Diagrams are rendered with an expandable card per FR, showing the FR title and the mermaid visualization.

---

## 6. Requirements Architecture

```
spec/
├── spec.md                     # This document
├── stakeholder/                # StR-001 through StR-003
├── usecase/                    # US-001 through US-018
├── functional/                 # FR-001 through FR-028
├── non-functional/             # NFR-001 through NFR-005
├── tests.md                    # Test Matrix
└── assets/
    └── diagrams/
```

## 7. Functional Requirements

### Layer 1: Parser

---

#### FR-001: Parse Document into Section Tree

**Source**: US-001 | **Type**: Core

The `parseDocument()` function SHALL accept a raw markdown string and return a `QuireDocument` object containing a hierarchical tree of sections.

```typescript
interface QuireSection {
  id: string; // Stable identifier (slug of heading + startLine)
  heading: string; // Raw heading text (without # prefix)
  level: number; // 1-4 (h1-h4)
  content: string; // Raw markdown content between this heading and the next
  children: QuireSection[]; // Nested sub-sections
  startLine: number; // Line number in source document
  endLine: number; // Line number of last content line
}

interface QuireDocument {
  preamble: string | null; // Content before first heading
  sections: QuireSection[]; // Top-level sections
  raw: string; // Original markdown
}
```

**Acceptance Criteria**:

- FR-001-AC-1: Given `## A\ncontent\n## B\nmore`, then `sections` contains two items with headings "A" and "B".
- FR-001-AC-2: Given `## A\ncontent\n### A.1\nsub`, then section "A" has one child "A.1".
- FR-001-AC-3: Given `preamble text\n## First`, then `preamble` equals "preamble text".
- FR-001-AC-4: Given numbered headings `## 2.1 In Scope`, then `heading` is "2.1 In Scope" (full text preserved).
- FR-001-AC-5: Parse performance SHALL meet NFR-001 (< 10ms for 500 sections).

---

#### FR-005: Frontmatter Extraction

**Source**: US-007, US-015 | **Type**: Core

The `extractFrontmatter()` function SHALL extract YAML frontmatter delimited by `---` markers and return a typed object alongside the remaining body content.

```typescript
interface FrontmatterResult<T = Record<string, unknown>> {
  frontmatter: T | null;
  body: string;
}

function extractFrontmatter<T>(md: string): FrontmatterResult<T>;
```

**Acceptance Criteria**:

- FR-005-AC-1: Given `---\nfoo: bar\n---\nbody`, then `frontmatter` is `{ foo: "bar" }` and `body` is "body".
- FR-005-AC-2: Given no `---` markers, then `frontmatter` is `null` and `body` is the full input.
- FR-005-AC-3: Given `standards_alignment: [iso-29148, ieee-828]`, then `frontmatter.standards_alignment` is `["iso-29148", "ieee-828"]`.
- FR-005-AC-4: Given `related_standards: [cloudevents]`, then `frontmatter.related_standards` is `["cloudevents"]`.

---

### Layer 2: Query API

---

#### FR-002: Section Query by Heading

**Source**: US-002 | **Type**: Query

The `section()` function SHALL locate a section by heading text, matching case-insensitively and ignoring leading section numbers.

**Matching algorithm**: Strip the regex pattern `/^\d+(\.\d+)*\.?\s*/` from the heading, then perform a case-insensitive exact match against the query string.

```typescript
function section(doc: QuireDocument, heading: string): QuireSection | null;
function sections(doc: QuireDocument, opts?: { level?: number }): QuireSection[];
```

**Acceptance Criteria**:

- FR-002-AC-1: Given heading "Purpose", then it matches `## Purpose`, `## 1. Purpose`, and `### Purpose`.
- FR-002-AC-2: Given heading "in scope", then it matches `## In Scope` (case-insensitive).
- FR-002-AC-3: Given a non-existent heading, then `null` is returned.
- FR-002-AC-4: Given `sections(doc, { level: 2 })`, then only `##` level sections are returned.
- FR-002-AC-5: Given heading "Scope", then it does NOT match `## 2.1 In Scope` (exact match after number stripping, not substring).

---

#### FR-003: Table Extraction

**Source**: US-003, US-011, US-016 | **Type**: Query

The `parseTable()` function SHALL extract markdown tables from section content and return typed row arrays with headers separated from data rows.

```typescript
interface TableResult {
  headers: string[];
  rows: string[][];
}

function parseTable(sectionContent: string): TableResult;
function tableFromSection(doc: QuireDocument, heading: string): TableResult;
```

**Acceptance Criteria**:

- FR-003-AC-1: Given `| A | B |\n|---|---|\n| 1 | 2 |`, then `headers` is `["A", "B"]` and `rows` is `[["1", "2"]]`.
- FR-003-AC-2: Separator rows (`|---|---|`) SHALL be excluded from results.
- FR-003-AC-3: Leading and trailing pipe characters SHALL be stripped.
- FR-003-AC-4: Cell content SHALL be trimmed of whitespace.
- FR-003-AC-5: Given a section with no table, then `headers` is `[]` and `rows` is `[]`.
- FR-003-AC-6: Given a section with multiple tables, `parseTable()` returns the first table. A `parseTables()` function (plural) SHALL return all tables.
- FR-003-AC-7: Given a table row with inconsistent column count, short rows SHALL be padded with empty strings and long rows SHALL be truncated to header count.

---

#### FR-004: Structured List Extraction

**Source**: US-004, US-012 | **Type**: Query

The `parseBulletList()` function SHALL extract bullet list items and parse structured patterns within them.

```typescript
interface ListItem {
  raw: string; // Full bullet text
  title: string; // Bold portion or full text
  description: string; // Text after separator or empty
}

function parseBulletList(
  content: string,
  opts?: {
    pattern?: 'bold-description' | 'bold-colon' | 'plain';
  }
): ListItem[];
```

**Acceptance Criteria**:

- FR-004-AC-1: Given `- **Auth** — Token-based authentication`, then `title` is "Auth" and `description` is "Token-based authentication".
- FR-004-AC-2: Given `- **Auth**: Token-based`, then `title` is "Auth" and `description` is "Token-based" (colon separator).
- FR-004-AC-3: Given `- Simple item`, then `title` is "Simple item" and `description` is empty.
- FR-004-AC-4: Lines not starting with `-` or `*` SHALL be excluded.

---

#### FR-006: Diagram Extraction and Classification

**Source**: US-010, US-014, US-018 | **Type**: Query

The `extractDiagrams()` function SHALL extract fenced code blocks by language identifier and optionally classify them.

```typescript
interface DiagramBlock {
  index: number; // Position in document (0-based)
  language: string; // "mermaid", "plantuml", etc.
  source: string; // Raw diagram source
  section: string | null; // Heading of containing section
  classification: string | null; // "logical", "deployment", etc.
}

function extractDiagrams(
  doc: QuireDocument,
  opts?: {
    language?: string;
    classify?: boolean;
  }
): DiagramBlock[];
```

**Acceptance Criteria**:

- FR-006-AC-1: Given a ` ```mermaid ` fenced block, then `language` is "mermaid" and `source` contains the block content.
- FR-006-AC-2: Given `classify: true`, diagrams containing `deployment|k8s|pod|namespace|ingress|cluster` keywords SHALL be classified as "deployment".
- FR-006-AC-3: The first non-deployment diagram SHALL be classified as "logical" when classification is enabled.
- FR-006-AC-4: Given a diagram inside `## Architecture`, then `section` is "Architecture".

---

#### FR-007: Full-text Search Across Sections

**Source**: US-002 | **Type**: Query

The `search()` function SHALL perform case-insensitive full-text search across all section content and return matching sections with match context.

```typescript
interface SearchResult {
  section: QuireSection;
  matches: { line: number; text: string }[];
}

function search(doc: QuireDocument, query: string): SearchResult[];
```

**Acceptance Criteria**:

- FR-007-AC-1: Given query "authentication", then all sections containing that word are returned.
- FR-007-AC-2: Search SHALL be case-insensitive.
- FR-007-AC-3: Each match SHALL include the line number and matching line text.

---

#### FR-019: Delegation Annotation Parsing

**Source**: US-012 | **Type**: Query

The `parseDelegations()` function SHALL extract delegation annotations from bracket-enclosed phrases in bullet list items.

```typescript
interface DelegatedItem {
  item: string; // Text without annotation
  delegation: string | undefined; // Target component
}

function parseDelegations(content: string): DelegatedItem[];
```

**Acceptance Criteria**:

- FR-019-AC-1: Given `- Auth tokens (handled by auth-service)`, then `item` is "Auth tokens" and `delegation` is "auth-service".
- FR-019-AC-2: Given `- Auth tokens (delegated to auth-service)`, then same result.
- FR-019-AC-3: Given `- Simple item`, then `delegation` is `undefined`.

---

#### FR-020: Diagram Classification

**Source**: US-014 | **Type**: Query

The `classifyDiagrams()` function SHALL classify an array of diagrams into named categories based on content analysis.

**Acceptance Criteria**:

- FR-020-AC-1: Given two diagrams where the second contains `k8s`, then `logical` is the first and `deployment` is the second.
- FR-020-AC-2: Given one diagram with no deployment keywords, then it serves as both `logical` and `deployment`.
- FR-020-AC-3: Classification SHALL be idempotent.

---

#### FR-022: ADR Artifact Section Parser

**Source**: US-017 | **Type**: Query

The `parseADR()` function SHALL parse an Architecture Decision Record into its standard sections.

```typescript
interface ParsedADR {
  id: string;
  title: string;
  context: string;
  decision: string;
  rationale: string;
  status: string;
}

function parseADR(content: string, meta: { id: string; title: string }): ParsedADR;
```

**Acceptance Criteria**:

- FR-022-AC-1: Given `## Context\ntext\n## Decision\ntext`, then `context` and `decision` are extracted.
- FR-022-AC-2: Given no `## Status` section, then `status` defaults to "Accepted".
- FR-022-AC-3: Sections not matching standard ADR headings SHALL be preserved in a `raw` field.

---

### Layer 3: React Context + Rendering

---

#### FR-008: QuireProvider React Context

**Source**: US-005 | **Type**: Context

The `QuireProvider` component SHALL parse the provided markdown content and make the resulting `QuireDocument` available to descendant components via React context.

```tsx
<QuireProvider content={markdownString} onChange={handleChange}>
  {children}
</QuireProvider>
```

**Acceptance Criteria**:

- FR-008-AC-1: Given `content` prop, then `parseDocument()` is called and the result is available via `useQuire()`.
- FR-008-AC-2: Given `content` changes, then the document is re-parsed and all hooks re-compute.
- FR-008-AC-3: Given `onChange` callback, then section mutations trigger `onChange` with the serialized markdown.
- FR-008-AC-4: Parsing SHALL be memoized — identical content SHALL NOT trigger re-parse.

---

#### FR-009: useSection Hook

**Source**: US-005 | **Type**: Hook

```typescript
function useSection(heading: string): { content: string | null; section: QuireSection | null };
```

**Acceptance Criteria**:

- FR-009-AC-1: Given a valid heading, then `content` is the section's raw markdown content.
- FR-009-AC-2: Given a non-existent heading, then both fields are `null`.
- FR-009-AC-3: The hook SHALL re-render only when the target section's content changes.
- FR-009-AC-4: Given the hook is called outside a `QuireProvider`, then a `QuireContextError` is thrown with a descriptive message.

---

#### FR-010: useTable Hook

**Source**: US-003, US-011, US-016 | **Type**: Hook

```typescript
function useTable(heading: string): TableResult;
```

**Acceptance Criteria**:

- FR-010-AC-1: Returns the `TableResult` for the first table in the named section.
- FR-010-AC-2: Given no table in the section, returns empty headers and rows.

---

#### FR-011: useList Hook

**Source**: US-004, US-012 | **Type**: Hook

```typescript
function useList(heading: string, opts?: { pattern?: string }): ListItem[];
```

**Acceptance Criteria**:

- FR-011-AC-1: Returns parsed bullet list items from the named section.
- FR-011-AC-2: Given `pattern: 'bold-description'`, items are parsed with title/description splitting.

---

#### FR-012: useFrontmatter Hook

**Source**: US-007, US-015 | **Type**: Hook

```typescript
function useFrontmatter<T>(): T | null;
```

**Acceptance Criteria**:

- FR-012-AC-1: Returns the parsed frontmatter object from the document.
- FR-012-AC-2: Given no frontmatter, returns `null`.

---

#### FR-013: useDiagram Hook

**Source**: US-010, US-014 | **Type**: Hook

```typescript
function useDiagram(heading?: string): DiagramBlock[];
```

**Acceptance Criteria**:

- FR-013-AC-1: Given no heading, returns all diagrams in the document.
- FR-013-AC-2: Given a heading, returns only diagrams within that section.

---

#### FR-014: Section Update and Write-back

**Source**: US-006 | **Type**: Mutation

The `updateSection()` function SHALL replace a section's content in the raw markdown and return the full updated document.

```typescript
function updateSection(doc: QuireDocument, heading: string, newContent: string): string;
```

**Acceptance Criteria**:

- FR-014-AC-1: The target section's content is replaced with `newContent`.
- FR-014-AC-2: All other sections remain byte-identical.
- FR-014-AC-3: Frontmatter is preserved.
- FR-014-AC-4: Round-trip fidelity SHALL meet NFR-002.

---

#### FR-015: SectionCard Component

**Source**: US-008 | **Type**: UI Component

A themed card wrapper that renders a named section's content. Defaults to `markdown-editor` in read-only mode; supports custom render functions.

```tsx
<SectionCard
  heading="Purpose"
  icon={<BookOpen size={16} />}
  render={(content) => <CustomRenderer content={content} />} // optional
  editable={false}
/>
```

**Acceptance Criteria**:

- FR-015-AC-1: Given no `render` prop, section content is displayed via `markdown-editor` read-only.
- FR-015-AC-2: Given a `render` prop, the custom renderer receives the raw section content.
- FR-015-AC-3: Given `editable`, content is displayed via `markdown-editor` in editable mode, and changes trigger `onChange` on the `QuireProvider`.
- FR-015-AC-4: Card styling uses `ix-themes` tokens (background, border, radius, shadow).

---

#### FR-016: SectionTable Component

**Source**: US-008, US-011, US-016 | **Type**: UI Component

A component that parses a section's markdown table into typed rows and renders as an interactive, themed table.

```tsx
<SectionTable
  heading="API Endpoints"
  columns={['Method', 'Endpoint', 'Description']}
  cellRenderers={{
    Method: (value) => <MethodBadge method={value} />,
    Endpoint: (value) => <code>{value}</code>,
  }}
/>
```

**Acceptance Criteria**:

- FR-016-AC-1: Table headers are rendered with uppercase styling and muted foreground.
- FR-016-AC-2: Given `cellRenderers`, custom render functions are applied per column.
- FR-016-AC-3: Alternating row backgrounds SHALL use muted theme tones.
- FR-016-AC-4: Given no table in the section, a "No data" fallback message is shown.

---

#### FR-017: SectionList Component

**Source**: US-008, US-012 | **Type**: UI Component

A component that parses a section's bullet list and renders items with structured layout.

```tsx
<SectionList
  heading="In Scope"
  pattern="bold-description"
  layout="grid" // 'grid' | 'stack'
  columns={3} // for grid layout
  itemIcon={<CheckCircle2 />}
/>
```

**Acceptance Criteria**:

- FR-017-AC-1: Given `layout="grid"` and `columns={3}`, items render in a 3-column CSS grid.
- FR-017-AC-2: Given `pattern="bold-description"`, items display title (bold) and description (muted).
- FR-017-AC-3: Given `itemIcon`, each item is prefixed with the icon.
- FR-017-AC-4: Given delegation annotations (FR-019), `→ delegation` suffix is rendered in muted text.

---

#### FR-018: AutoSections Component

**Source**: US-008 | **Type**: UI Component

A component that automatically renders all sections in the document as cards, using registered renderers where available and `markdown-editor` fallback otherwise.

```tsx
<AutoSections
  exclude={['Frontmatter']}
  renderers={{
    'API Endpoints': (content) => <SectionTable ... />,
    'In Scope': (content) => <SectionList ... />,
  }}
/>
```

**Acceptance Criteria**:

- FR-018-AC-1: All document sections render as cards in document order.
- FR-018-AC-2: Sections with a matching renderer use that renderer.
- FR-018-AC-3: Sections without a renderer fall back to `markdown-editor` read-only.
- FR-018-AC-4: Given `exclude`, those sections are not rendered.

---

#### FR-021: Standards Resolution from Frontmatter

**Source**: US-015 | **Type**: UI Logic

The `useStandardsAlignment()` hook SHALL extract standards codes from frontmatter and resolve them against a provided standards list.

```typescript
interface ResolvedStandard {
  code: string;
  id: string | null;
  name: string | null;
  resolved: boolean;
}

function useStandardsAlignment(standards: StandardRead[]): ResolvedStandard[];
```

**Acceptance Criteria**:

- FR-021-AC-1: Given frontmatter `standards_alignment: [iso-29148]` and a matching standard in the database, then `resolved` is `true` with `id` and `name` populated.
- FR-021-AC-2: Given an unresolvable code, then `resolved` is `false` and `code` is preserved as display fallback.
- FR-021-AC-3: Resolution SHALL match by `code`, `id`, or `name` (case-insensitive).

---

#### FR-023: Grouped Dependency Renderer

**Source**: US-013 | **Type**: UI Component

A component that classifies dependency summaries by type and renders them in a multi-column layout.

```tsx
<GroupedDependencies
  dependencies={allDeps}
  groups={[
    { key: 'backend', label: 'Backend', icon: <Server />, filter: (d) => !isLib(d) && !isUI(d) },
    { key: 'libraries', label: 'Libraries & SDKs', icon: <BookOpen />, filter: isLib },
    { key: 'ui', label: 'UI', icon: <LayoutGrid />, filter: isUI },
  ]}
  onNavigate={(dep) => navigate(`/repos/${dep.name}`)}
/>
```

**Acceptance Criteria**:

- FR-023-AC-1: Dependencies are classified into groups based on filter functions.
- FR-023-AC-2: Each group renders as a column with a label header, count badge, and stacked component rows.
- FR-023-AC-3: Component rows display element icon, name, type badge, and description.
- FR-023-AC-4: Components are clickable via `onNavigate`.
- FR-023-AC-5: Empty groups display "None" in muted italic.

---

### Layer 4: Graph Query

---

#### FR-024: QuireGraphProvider

**Source**: US-009, US-018 | **Type**: Context

The `QuireGraphProvider` component SHALL accept multiple documents and optional aggregated business objects, making them queryable by descendant components.

```tsx
<QuireGraphProvider
  documents={[
    { id: 'auth-service', content: authMd, type: 'spec' },
    { id: 'gateway', content: gatewayMd, type: 'spec' },
  ]}
  artifacts={allArtifacts}
  objects={aggregatedObjects}
>
  {children}
</QuireGraphProvider>
```

**Acceptance Criteria**:

- FR-024-AC-1: Each document is parsed via `parseDocument()` and stored in the graph.
- FR-024-AC-2: Artifacts are indexed by `artifact_type` and source repo.
- FR-024-AC-3: Business objects are indexed by `object_type`.
- FR-024-AC-4: The graph is re-computed when `documents`, `artifacts`, or `objects` props change.

---

#### FR-025: useGraphQuery Hook

**Source**: US-009 | **Type**: Hook

```typescript
interface GraphQueryOptions {
  type?: string; // 'api_endpoint', 'entity', 'domain', 'event', etc.
  artifactType?: string; // 'FR', 'NFR', 'ADR', etc.
  groupBy?: 'repo' | 'type';
  repo?: string; // Filter to a specific repo
}

function useGraphQuery(opts: GraphQueryOptions): {
  results: GraphResult[];
  grouped: Record<string, GraphResult[]>;
};
```

**Acceptance Criteria**:

- FR-025-AC-1: Given `type: 'api_endpoint'`, then all API endpoint business objects across all repos are returned.
- FR-025-AC-2: Given `artifactType: 'FR'`, then all FR artifacts across all repos are returned.
- FR-025-AC-3: Given `groupBy: 'repo'`, then results are grouped by source repository.
- FR-025-AC-4: Given `repo: 'auth-service'`, then only that repo's results are returned.

---

#### FR-026: GraphTable Component

**Source**: US-009 | **Type**: UI Component

A component that renders graph query results as a themed, sortable table.

```tsx
<GraphTable
  type="api_endpoint"
  columns={['Method', 'Path', 'Description', 'Repo']}
  onRowClick={(row) => navigate(`/repos/${row.repo}`)}
/>
```

**Acceptance Criteria**:

- FR-026-AC-1: Table auto-populates from graph query results matching the `type`.
- FR-026-AC-2: Columns are configurable and map to business object fields.
- FR-026-AC-3: A "Repo" column is automatically appended if results span multiple repos.
- FR-026-AC-4: Rows are clickable via `onRowClick`.

---

### Cross-cutting

---

#### FR-027: Error Handling and Edge Cases

**Source**: US-001, US-003, US-007 | **Type**: Core

All Layer 1+2 functions SHALL handle malformed and edge-case input gracefully without throwing.

**Acceptance Criteria**:

- FR-027-AC-1: Given an empty string input to `parseDocument()`, then return `{ preamble: null, sections: [], raw: '' }`.
- FR-027-AC-2: Given malformed/invalid YAML in frontmatter, `extractFrontmatter()` SHALL return `{ frontmatter: null, body: fullInput }` (no throw).
- FR-027-AC-3: Given an unclosed fenced code block (` ``` ` without closing), the parser SHALL treat the remainder as code block content.
- FR-027-AC-4: Given a heading with only whitespace content (`## \n## Next`), the section SHALL have an empty string `content`.
- FR-027-AC-5: Given `null` or `undefined` input to any parser function, a `TypeError` SHALL be thrown with a descriptive message.

---

#### FR-028: Render Error Boundaries

**Source**: US-008 | **Type**: UI Component

All render callback extension points SHALL catch errors and fall back to safe defaults.

**Failure Policy**:

- **Render callbacks** (`render`, `cellRenderers`, `renderers`, `filter`): **Resilient** — errors are caught by an error boundary and fall back to the default renderer (`markdown-editor` read-only for sections, raw text for cells). Errors are logged via `console.error`.
- **Mutation callbacks** (`onChange`, `onNavigate`, `onRowClick`): **Strict** — errors propagate to the consumer.

**Acceptance Criteria**:

- FR-028-AC-1: Given a `SectionCard.render` prop that throws, then the card falls back to `markdown-editor` read-only and the error is logged.
- FR-028-AC-2: Given a `SectionTable.cellRenderers` function that throws, then the cell displays raw text.
- FR-028-AC-3: Given an `AutoSections.renderers` entry that throws, then that section falls back to `markdown-editor` read-only.
- FR-028-AC-4: Given a `GroupedDependencies.filter` function that throws, then the item is excluded from all groups and the error is logged.
- FR-028-AC-5: Given a `QuireProvider.onChange` callback that throws, then the error propagates to the consumer (strict).

## 8. Non-Functional Requirements

---

#### NFR-001: Parse Performance

**Attribute**: Performance

The parser SHALL handle large documents without perceptible delay.

**Acceptance Criteria**:

- NFR-001-AC-1: `parseDocument()` SHALL complete in < 10ms for a document with 500 sections (measured via `performance.now()`).
- NFR-001-AC-2: `extractFrontmatter()` SHALL complete in < 1ms for any document.
- NFR-001-AC-3: Hook re-computation after content change SHALL complete within a single React render cycle.

---

#### NFR-002: Round-trip Fidelity

**Attribute**: Reliability

Markdown content SHALL survive parse → serialize cycles without any content loss or corruption.

**Acceptance Criteria**:

- NFR-002-AC-1: Given a document parsed via `parseDocument()` and serialized back via `updateSection()`, then the output SHALL be byte-identical to the input (when no section is modified).
- NFR-002-AC-2: Frontmatter, blank lines, trailing whitespace, and fenced code blocks SHALL be preserved.
- NFR-002-AC-3: A test suite SHALL verify round-trip fidelity against a corpus of at least 10 real spec documents from the ecosystem.

---

#### NFR-003: Bundle Size and Tree-shakeability

**Attribute**: Portability

Layer 1+2 SHALL be usable without React, enabling non-UI consumers (agents, scripts, CLI tools) to use the parsing/query API.

**Acceptance Criteria**:

- NFR-003-AC-1: Layer 1+2 exports SHALL have zero React imports.
- NFR-003-AC-2: `import { parseDocument, section, parseTable } from '@agent-ix/quire/core'` SHALL work without React in the dependency tree.
- NFR-003-AC-3: The full library bundle (Layer 1-4) SHALL be < 50KB gzipped (excluding peer dependencies).

---

#### NFR-004: Theme Integration

**Attribute**: Usability

All UI components SHALL use `ix-themes` tokens for consistent styling across light and dark modes.

**Acceptance Criteria**:

- NFR-004-AC-1: No hardcoded color values in component source — all colors SHALL reference theme tokens.
- NFR-004-AC-2: Components SHALL render correctly in both light and dark theme modes.
- NFR-004-AC-3: Card borders, backgrounds, and shadows SHALL use the same patterns as `ApplicationDetailPage`.

---

#### NFR-005: Test Coverage

**Attribute**: Maintainability

All layers SHALL maintain test coverage above established thresholds.

**Acceptance Criteria**:

- NFR-005-AC-1: Layer 1+2 (parser/query) SHALL maintain ≥ 90% line coverage.
- NFR-005-AC-2: Layer 3+4 (React components/hooks) SHALL maintain ≥ 80% line coverage.
- NFR-005-AC-3: Every FR SHALL have at least one corresponding test case.
- NFR-005-AC-4: Round-trip fidelity tests (NFR-002) SHALL be included in the CI suite.

---

## 9. References

- ISO/IEC/IEEE 29148 — Requirements Engineering
- [typesetter](ix://agent-ix/typesetter) — Rich text rendering (complementary)
- [markdown-editor](ix://agent-ix/markdown-editor) — Content rendering and editing (peer dependency)
- [ApplicationDetailPage](file:///home/peter/dev/spec-editor-ui-catalog/src/ApplicationDetailPage.tsx) — Primary refactoring target (3000+ LOC)
- [StandardDetail](file:///home/peter/dev/spec-view-standard/src/components/StandardDetail.tsx) — Secondary refactoring target
- [editorUtils.ts](file:///home/peter/dev/spec-editor/src/components/editorUtils.ts) — Existing block parser (partial overlap)
