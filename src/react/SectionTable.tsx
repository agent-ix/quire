/**
 * FR-016: SectionTable Component
 * FR-028-AC-2: Cell renderer error boundary
 *
 * Renders a markdown table from a section as a styled HTML table.
 */
import { type ReactNode } from "react";
import { useTable } from "./QuireProvider";

export interface SectionTableProps {
  /** Section heading containing the table. */
  heading: string;
  /** Column names to display (maps to table headers). */
  columns?: string[];
  /** Custom cell renderers by column name. */
  cellRenderers?: Record<string, (value: string, row: string[]) => ReactNode>;
  /** Row click handler. */
  onRowClick?: (row: string[], index: number) => void;
  /** CSS class for the table container. */
  className?: string;
}

/**
 * SectionTable — extracts and renders a table from a document section.
 *
 * FR-016-AC-1: Parses markdown table from the heading section.
 * FR-016-AC-2: Renders with theme-compatible styling.
 * FR-028-AC-2: Cell renderer errors fall back to raw text.
 */
export function SectionTable({
  heading,
  columns,
  cellRenderers,
  onRowClick,
  className,
}: SectionTableProps) {
  const table = useTable(heading);

  if (table.headers.length === 0) return null;

  const displayColumns = columns ?? table.headers;

  return (
    <div className={`quire-section-table ${className ?? ""}`}>
      <table>
        <thead>
          <tr>
            {displayColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={onRowClick ? () => onRowClick(row, rowIdx) : undefined}
              style={onRowClick ? { cursor: "pointer" } : undefined}
            >
              {displayColumns.map((col, colIdx) => {
                const headerIdx = table.headers.indexOf(col);
                const value = headerIdx >= 0 ? (row[headerIdx] ?? "") : "";

                let cell: ReactNode;
                if (cellRenderers?.[col]) {
                  try {
                    cell = cellRenderers[col](value, row);
                  } catch (err) {
                    // FR-028-AC-2: Resilient — fall back to raw text
                    console.error(
                      `[Quire] Cell renderer error for "${col}":`,
                      err
                    );
                    cell = value;
                  }
                } else {
                  cell = value;
                }

                return <td key={col}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
