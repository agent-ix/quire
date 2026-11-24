/**
 * Core module — Layer 1+2.
 * Pure TypeScript, zero React dependency.
 * Provides the parser and query APIs without React components.
 */

// Types
export type {
  QuireSection,
  QuireDocument,
  FrontmatterResult,
  TableResult,
  ListItem,
  DiagramBlock,
  DelegatedItem,
  ListPattern,
} from './types';

// Layer 1: Parser
export { parseDocument } from './parser';
export { extractFrontmatter } from './frontmatter';

// Layer 2: Query
export {
  section,
  sections,
  parseTable,
  parseTables,
  tableFromSection,
  parseBulletList,
  extractDiagrams,
  findDiagramByTag,
  parseDelegations,
  search,
} from './query';
export type { SearchResult } from './query';

// Write-back
export { updateSection } from './writeback';
