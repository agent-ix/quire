/**
 * React layer — Layer 3.
 * QuireProvider, hooks, and section components.
 */

// Context and hooks
export {
  QuireProvider,
  QuireContextError,
  useQuire,
  useSection,
  useTable,
  useList,
  useFrontmatter,
  useDiagram,
} from './QuireProvider';
export type { QuireProviderProps, UseSectionResult } from './QuireProvider';

// Components
export { SectionCard } from './SectionCard';
export type { SectionCardProps } from './SectionCard';

export { SectionTable } from './SectionTable';
export type { SectionTableProps } from './SectionTable';

export { SectionList } from './SectionList';
export type { SectionListProps } from './SectionList';

export { AutoSections } from './AutoSections';
export type { AutoSectionsProps, SectionRenderer } from './AutoSections';

// Extensions: standards resolution, ADR parsing, grouped dependencies
export {
  useStandardsAlignment,
  parseADRFromContent,
  groupDependencies,
  useGroupedDependencies,
  extractFRDiagrams,
} from './extensions';
export type {
  StandardRecord,
  ResolvedStandard,
  ParsedADR,
  DependencySummary,
  DependencyGroup,
  GroupedResult,
  FRDiagram,
} from './extensions';
