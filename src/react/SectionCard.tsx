/**
 * FR-015: SectionCard Component
 * FR-028: Render Error Boundaries
 *
 * A themed card that renders a document section.
 */
import { type ReactNode, type CSSProperties } from 'react';
import { useSection } from './QuireProvider';

export interface SectionCardProps {
  /** Heading to query from the document. */
  heading: string;
  /** Icon element to display in the card header. */
  icon?: ReactNode;
  /** Custom renderer — if provided, receives section content. */
  render?: (content: string) => ReactNode;
  /** CSS class for the card container. */
  className?: string;
  /** Inline styles for the card container. */
  style?: CSSProperties;
}

/**
 * SectionCard — renders a document section as a themed card.
 *
 * FR-015-AC-1: Falls back to raw markdown text when no custom render.
 * FR-015-AC-2: Accepts icon in header.
 * FR-028-AC-1: Catches render errors, falls back to raw text.
 */
export function SectionCard({ heading, icon, render, className, style }: SectionCardProps) {
  const { content } = useSection(heading);

  if (content === null) return null;

  let rendered: ReactNode;
  if (render) {
    try {
      rendered = render(content);
    } catch (err) {
      // FR-028-AC-1: Resilient — fall back to raw text
      console.error(`[Quire] SectionCard render error for "${heading}":`, err);
      rendered = <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>;
    }
  } else {
    // Default: raw text (consumer should wrap with markdown-editor)
    rendered = <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>;
  }

  return (
    <div className={`quire-section-card ${className ?? ''}`} style={style}>
      <div className="quire-section-card__header">
        {icon && <span className="quire-section-card__icon">{icon}</span>}
        <h3 className="quire-section-card__title">{heading}</h3>
      </div>
      <div className="quire-section-card__content">{rendered}</div>
    </div>
  );
}
