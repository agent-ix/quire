/**
 * FR-024: QuireGraphProvider
 * FR-025: useGraphQuery
 * FR-026: GraphTable
 *
 * Cross-document graph query layer.
 */
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { parseDocument } from "../core/parser";
import type { QuireDocument } from "../core/types";

// ─── Graph Types ─────────────────────────────────────────────────────────

export interface GraphDocument {
  /** Unique ID for this document (e.g. repo name). */
  id: string;
  /** Raw markdown content. */
  content: string;
  /** Document type hint (e.g. "spec", "fr", "adr"). */
  type?: string;
}

export interface GraphArtifact {
  id: string;
  repo: string;
  artifact_type: string;
  title: string;
  content?: string;
  [key: string]: unknown;
}

export interface GraphObject {
  id: string;
  repo: string;
  object_type: string;
  [key: string]: unknown;
}

export interface GraphResult {
  /** Source repo/document id. */
  repo: string;
  /** Object type (e.g. "api_endpoint", "FR"). */
  type: string;
  /** The raw data. */
  data: Record<string, unknown>;
}

// ─── Graph Context ───────────────────────────────────────────────────────

interface GraphContextValue {
  /** Parsed documents, keyed by id. */
  documents: Map<string, QuireDocument>;
  /** All artifacts, indexed. */
  artifacts: GraphArtifact[];
  /** All business objects, indexed. */
  objects: GraphObject[];
}

const GraphContext = createContext<GraphContextValue | null>(null);

function useGraphContext(): GraphContextValue {
  const ctx = useContext(GraphContext);
  if (!ctx) {
    throw new Error(
      "useGraphQuery must be used within a <QuireGraphProvider>"
    );
  }
  return ctx;
}

// ─── QuireGraphProvider (FR-024) ─────────────────────────────────────────

export interface QuireGraphProviderProps {
  /** Documents to index. */
  documents: GraphDocument[];
  /** Business artifacts to index. */
  artifacts?: GraphArtifact[];
  /** Aggregated business objects to index. */
  objects?: GraphObject[];
  children: ReactNode;
}

/**
 * QuireGraphProvider — parses and indexes multiple documents for graph queries.
 *
 * FR-024-AC-1: Each document parsed via parseDocument().
 * FR-024-AC-2: Artifacts indexed by artifact_type and repo.
 * FR-024-AC-3: Objects indexed by object_type.
 * FR-024-AC-4: Re-computed when inputs change.
 */
export function QuireGraphProvider({
  documents,
  artifacts = [],
  objects = [],
  children,
}: QuireGraphProviderProps) {
  const value = useMemo<GraphContextValue>(() => {
    // FR-024-AC-1: Parse all documents
    const parsedDocs = new Map<string, QuireDocument>();
    for (const doc of documents) {
      try {
        parsedDocs.set(doc.id, parseDocument(doc.content));
      } catch (err) {
        console.error(`[QuireGraph] Failed to parse document "${doc.id}":`, err);
      }
    }

    return {
      documents: parsedDocs,
      artifacts,
      objects,
    };
  }, [documents, artifacts, objects]);

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}

// ─── useGraphQuery (FR-025) ──────────────────────────────────────────────

export interface GraphQueryOptions {
  /** Filter by object_type (e.g. "api_endpoint", "entity"). */
  type?: string;
  /** Filter by artifact_type (e.g. "FR", "NFR", "ADR"). */
  artifactType?: string;
  /** Group results by "repo" or "type". */
  groupBy?: "repo" | "type";
  /** Filter to a specific repo. */
  repo?: string;
}

export interface GraphQueryResult {
  results: GraphResult[];
  grouped: Record<string, GraphResult[]>;
}

/**
 * Query across all indexed documents and objects.
 *
 * FR-025-AC-1: type filter returns objects of that type across all repos.
 * FR-025-AC-2: artifactType filter returns matching artifacts.
 * FR-025-AC-3: groupBy='repo' groups by source repo.
 * FR-025-AC-4: repo filter scopes to one repo.
 */
export function useGraphQuery(opts: GraphQueryOptions = {}): GraphQueryResult {
  const { artifacts, objects } = useGraphContext();

  return useMemo(() => {
    const results: GraphResult[] = [];

    // Query business objects by type
    if (opts.type) {
      for (const obj of objects) {
        if (opts.repo && obj.repo !== opts.repo) continue;
        if (obj.object_type === opts.type) {
          results.push({
            repo: obj.repo,
            type: obj.object_type,
            data: obj as Record<string, unknown>,
          });
        }
      }
    }

    // Query artifacts by type
    if (opts.artifactType) {
      for (const art of artifacts) {
        if (opts.repo && art.repo !== opts.repo) continue;
        if (art.artifact_type === opts.artifactType) {
          results.push({
            repo: art.repo,
            type: art.artifact_type,
            data: art as Record<string, unknown>,
          });
        }
      }
    }

    // If no filter specified, return all
    if (!opts.type && !opts.artifactType) {
      for (const obj of objects) {
        if (opts.repo && obj.repo !== opts.repo) continue;
        results.push({
          repo: obj.repo,
          type: obj.object_type,
          data: obj as Record<string, unknown>,
        });
      }
    }

    // Group results
    const grouped: Record<string, GraphResult[]> = {};
    if (opts.groupBy) {
      for (const r of results) {
        const key = opts.groupBy === "repo" ? r.repo : r.type;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
      }
    }

    return { results, grouped };
  }, [artifacts, objects, opts]);
}

// ─── GraphTable (FR-026) ─────────────────────────────────────────────────

export interface GraphTableProps {
  /** Object type to query. */
  type?: string;
  /** Artifact type to query. */
  artifactType?: string;
  /** Columns to display (mapped from result.data keys). */
  columns: string[];
  /** Row click handler. */
  onRowClick?: (result: GraphResult) => void;
  /** CSS class. */
  className?: string;
}

/**
 * GraphTable — renders graph query results as a sortable table.
 *
 * FR-026-AC-1: Populates from graph query results.
 * FR-026-AC-2: Columns map to result.data fields.
 * FR-026-AC-3: "Repo" column appended if results span multiple repos.
 * FR-026-AC-4: Rows clickable via onRowClick.
 */
export function GraphTable({
  type,
  artifactType,
  columns,
  onRowClick,
  className,
}: GraphTableProps) {
  const { results } = useGraphQuery({ type, artifactType });

  // FR-026-AC-3: Auto-append Repo if multiple repos
  const repos = new Set(results.map((r) => r.repo));
  const displayColumns =
    repos.size > 1 && !columns.includes("Repo")
      ? [...columns, "Repo"]
      : columns;

  if (results.length === 0) return null;

  return (
    <div className={`quire-graph-table ${className ?? ""}`}>
      <table>
        <thead>
          <tr>
            {displayColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((result, idx) => (
            <tr
              key={idx}
              onClick={onRowClick ? () => onRowClick(result) : undefined}
              style={onRowClick ? { cursor: "pointer" } : undefined}
            >
              {displayColumns.map((col) => {
                const value =
                  col === "Repo"
                    ? result.repo
                    : String(result.data[col] ?? result.data[col.toLowerCase()] ?? "");
                return <td key={col}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
