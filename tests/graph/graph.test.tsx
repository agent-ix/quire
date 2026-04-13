import { describe, it, expect } from 'vitest';
import { renderHook, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import { QuireGraphProvider, useGraphQuery, GraphTable } from '../../src/graph/index';

function wrapper(
  documents: { id: string; content: string }[],
  artifacts: unknown[] = [],
  objects: unknown[] = []
) {
  return function W({ children }: { children: ReactNode }) {
    return (
      <QuireGraphProvider
        documents={documents}
        artifacts={artifacts as never}
        objects={objects as never}
      >
        {children}
      </QuireGraphProvider>
    );
  };
}

// ─── QuireGraphProvider (FR-024) ─────────────────────────────────────────

describe('QuireGraphProvider (FR-024)', () => {
  it('FR-024-AC-1: indexes documents', () => {
    const docs = [{ id: 'auth', content: '## Purpose\ncontent' }];
    const { result } = renderHook(() => useGraphQuery(), {
      wrapper: wrapper(docs),
    });
    expect(result.current.results).toHaveLength(0); // no objects added
  });
});

// ─── useGraphQuery (FR-025) ──────────────────────────────────────────────

describe('useGraphQuery (FR-025)', () => {
  const objects = [
    { id: 'obj1', repo: 'auth-service', object_type: 'api_endpoint', method: 'GET', path: '/api' },
    { id: 'obj2', repo: 'catalog', object_type: 'api_endpoint', method: 'POST', path: '/items' },
    { id: 'obj3', repo: 'auth-service', object_type: 'entity', name: 'User' },
  ];

  it('FR-025-AC-1: filters by object type', () => {
    const { result } = renderHook(() => useGraphQuery({ type: 'api_endpoint' }), {
      wrapper: wrapper([], [], objects),
    });
    expect(result.current.results).toHaveLength(2);
  });

  it('FR-025-AC-3: groups by repo', () => {
    const { result } = renderHook(() => useGraphQuery({ type: 'api_endpoint', groupBy: 'repo' }), {
      wrapper: wrapper([], [], objects),
    });
    expect(result.current.grouped['auth-service']).toHaveLength(1);
    expect(result.current.grouped['catalog']).toHaveLength(1);
  });

  it('FR-025-AC-4: filters by repo', () => {
    const { result } = renderHook(() => useGraphQuery({ type: 'api_endpoint', repo: 'catalog' }), {
      wrapper: wrapper([], [], objects),
    });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].repo).toBe('catalog');
  });
});

// ─── useGraphQuery — artifact queries (FR-025-AC-2) ─────────────────────

describe('useGraphQuery artifact filter (FR-025-AC-2)', () => {
  const artifacts = [
    { id: 'fr-1', repo: 'auth-service', artifact_type: 'FR', title: 'Parse Document' },
    { id: 'nfr-1', repo: 'auth-service', artifact_type: 'NFR', title: 'Performance' },
  ];

  it('filters by artifact type', () => {
    const { result } = renderHook(() => useGraphQuery({ artifactType: 'FR' }), {
      wrapper: wrapper([], artifacts, []),
    });
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].data.artifact_type).toBe('FR');
  });
});

// ─── GraphTable (FR-026) ──────────────────────────────────────────────────

describe('GraphTable (FR-026)', () => {
  const objects = [
    { id: 'obj1', repo: 'auth', object_type: 'api_endpoint', method: 'GET', path: '/api' },
    { id: 'obj2', repo: 'catalog', object_type: 'api_endpoint', method: 'POST', path: '/items' },
  ];

  it('FR-026-AC-1: renders results as table', () => {
    render(
      <QuireGraphProvider objects={objects as never} documents={[]}>
        <GraphTable type="api_endpoint" columns={['method', 'path']} />
      </QuireGraphProvider>
    );
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api')).toBeInTheDocument();
  });

  it('FR-026-AC-3: auto-appends Repo when multiple repos', () => {
    render(
      <QuireGraphProvider objects={objects as never} documents={[]}>
        <GraphTable type="api_endpoint" columns={['method', 'path']} />
      </QuireGraphProvider>
    );
    expect(screen.getByText('Repo')).toBeInTheDocument();
    expect(screen.getByText('auth')).toBeInTheDocument();
  });
});
