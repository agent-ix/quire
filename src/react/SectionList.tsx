/**
 * FR-017: SectionList Component
 *
 * Renders a bullet list from a section with optional structured patterns.
 */
import { type ReactNode, type CSSProperties } from "react";
import { useList } from "./QuireProvider";
import type { ListPattern } from "../core/types";

export interface SectionListProps {
  /** Section heading containing the list. */
  heading: string;
  /** Pattern for parsing title/description. */
  pattern?: ListPattern;
  /** Layout mode. */
  layout?: "grid" | "stack";
  /** Grid column count (for grid layout). */
  columns?: number;
  /** Icon to prefix each item. */
  itemIcon?: ReactNode;
  /** CSS class for the list container. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
}

/**
 * SectionList — extracts and renders a bullet list from a document section.
 *
 * FR-017-AC-1: Grid layout with configurable columns.
 * FR-017-AC-2: Bold-description pattern splits title/description.
 * FR-017-AC-3: Item icon prefix.
 * FR-017-AC-4: Delegation annotations display in muted text.
 */
export function SectionList({
  heading,
  pattern = "bold-description",
  layout = "stack",
  columns = 3,
  itemIcon,
  className,
  style,
}: SectionListProps) {
  const items = useList(heading, { pattern });

  if (items.length === 0) return null;

  const containerStyle: CSSProperties = {
    ...style,
    ...(layout === "grid"
      ? {
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "0.75rem",
        }
      : {}),
  };

  return (
    <div
      className={`quire-section-list ${className ?? ""}`}
      style={containerStyle}
    >
      {items.map((item, idx) => (
        <div key={idx} className="quire-section-list__item">
          {itemIcon && (
            <span className="quire-section-list__icon">{itemIcon}</span>
          )}
          <div className="quire-section-list__body">
            <span className="quire-section-list__title">{item.title}</span>
            {item.description && (
              <span className="quire-section-list__description">
                {item.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
