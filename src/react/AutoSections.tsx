/**
 * FR-018: AutoSections Component
 * FR-028-AC-3: Renderer error boundary
 *
 * Automatically renders all document sections as cards.
 */
import { type ReactNode } from 'react';
import { useQuire } from './QuireProvider';
import { SectionCard } from './SectionCard';
import type { QuireSection } from '../core/types';

/** Type for section renderer functions. */
export type SectionRenderer = (content: string, section: QuireSection) => ReactNode;

export interface AutoSectionsProps {
  /** Section headings to exclude. */
  exclude?: string[];
  /** Custom renderers by heading name. */
  renderers?: Record<string, SectionRenderer>;
  /** CSS class for the container. */
  className?: string;
}

/**
 * AutoSections — renders all sections in document order.
 *
 * FR-018-AC-1: All sections render as cards.
 * FR-018-AC-2: Registered renderers used where available.
 * FR-018-AC-3: Fallback to raw text.
 * FR-018-AC-4: Excluded sections omitted.
 */
export function AutoSections({ exclude = [], renderers = {}, className }: AutoSectionsProps) {
  const doc = useQuire();

  const excludeSet = new Set(exclude.map((e) => e.toLowerCase()));

  // Flatten top-level sections only
  const visibleSections = doc.sections.filter((s) => !excludeSet.has(s.heading.toLowerCase()));

  return (
    <div className={`quire-auto-sections ${className ?? ''}`}>
      {visibleSections.map((s) => {
        const renderer = renderers[s.heading];

        if (renderer) {
          // FR-018-AC-2: Custom renderer with error boundary
          return (
            <div key={s.id} className="quire-auto-sections__section">
              <AutoSectionRendered section={s} renderer={renderer} />
            </div>
          );
        }

        // FR-018-AC-3: Fallback
        return <SectionCard key={s.id} heading={s.heading} />;
      })}
    </div>
  );
}

/** Inner component with error boundary for custom renderers (FR-028-AC-3). */
function AutoSectionRendered({
  section: s,
  renderer,
}: {
  section: QuireSection;
  renderer: SectionRenderer;
}) {
  try {
    return <>{renderer(s.content, s)}</>;
  } catch (err) {
    console.error(`[Quire] AutoSections renderer error for "${s.heading}":`, err);
    return <pre style={{ whiteSpace: 'pre-wrap' }}>{s.content}</pre>;
  }
}
