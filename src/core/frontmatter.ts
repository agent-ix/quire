/**
 * FR-005: Frontmatter Extraction
 * FR-027-AC-2: Malformed YAML returns null, body = full input.
 *
 * Extracts YAML frontmatter delimited by --- markers.
 */
import type { FrontmatterResult } from './types';

/**
 * Simple YAML parser for frontmatter — handles common patterns
 * (key: value, key: [array], key: true/false/number).
 * Does NOT support nested objects or multi-line strings.
 * Returns null on parse failure.
 */
function parseSimpleYaml(yamlStr: string): Record<string, unknown> | null {
  try {
    const result: Record<string, unknown> = {};
    const lines = yamlStr.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0 || trimmed.startsWith('#')) continue;

      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) return null; // malformed

      const key = trimmed.slice(0, colonIdx).trim();
      let value: unknown = trimmed.slice(colonIdx + 1).trim();

      if (typeof value === 'string') {
        // Array: [a, b, c]
        if (value.startsWith('[') && value.endsWith(']')) {
          const inner = value.slice(1, -1);
          value = inner
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        } else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (value.length > 0 && !isNaN(Number(value))) {
          value = Number(value);
        } else if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
      }

      result[key] = value;
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

/**
 * Extract YAML frontmatter from a markdown string.
 *
 * FR-005-AC-1: --- delimited frontmatter is parsed into an object.
 * FR-005-AC-2: No --- markers → null frontmatter, body = full input.
 * FR-027-AC-2: Malformed YAML → null frontmatter, body = full input.
 */
export function extractFrontmatter<T = Record<string, unknown>>(
  markdown: string
): FrontmatterResult<T> {
  if (markdown == null) {
    throw new TypeError(`extractFrontmatter() expects a string, received ${typeof markdown}`);
  }

  // Frontmatter must start at the very beginning of the document
  if (!markdown.startsWith('---')) {
    return { frontmatter: null, body: markdown };
  }

  // Find the closing ---
  const endIdx = markdown.indexOf('\n---', 3);
  if (endIdx === -1) {
    // No closing --- found — no frontmatter
    return { frontmatter: null, body: markdown };
  }

  const yamlStr = markdown.slice(4, endIdx); // skip opening "---\n"
  const body = markdown.slice(endIdx + 4).replace(/^\n/, ''); // skip closing "---\n"

  const parsed = parseSimpleYaml(yamlStr);
  if (parsed === null) {
    // FR-027-AC-2: malformed YAML → null frontmatter, body = full input
    return { frontmatter: null, body: markdown };
  }

  return {
    frontmatter: parsed as T,
    body,
  };
}
