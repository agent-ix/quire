import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QuireProvider } from "../../src/react/QuireProvider";
import { SectionCard } from "../../src/react/SectionCard";
import { SectionTable } from "../../src/react/SectionTable";
import { SectionList } from "../../src/react/SectionList";
import { AutoSections } from "../../src/react/AutoSections";

// ─── SectionCard (FR-015) ───────────────────────────────────────────────

describe("SectionCard (FR-015)", () => {
  it("FR-015-AC-1: renders section content", () => {
    const md = "## Purpose\nThis is the purpose";
    render(
      <QuireProvider content={md}>
        <SectionCard heading="Purpose" />
      </QuireProvider>
    );

    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(screen.getByText("This is the purpose")).toBeInTheDocument();
  });

  it("FR-015-AC-2: renders icon", () => {
    const md = "## Info\ncontent";
    render(
      <QuireProvider content={md}>
        <SectionCard heading="Info" icon={<span data-testid="icon">★</span>} />
      </QuireProvider>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("FR-015-AC-3: returns null for missing section", () => {
    const md = "## Other\ncontent";
    const { container } = render(
      <QuireProvider content={md}>
        <SectionCard heading="Missing" />
      </QuireProvider>
    );

    expect(container.querySelector(".quire-section-card")).toBeNull();
  });

  it("FR-028-AC-1: catches render errors", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const md = "## Test\ncontent";
    render(
      <QuireProvider content={md}>
        <SectionCard
          heading="Test"
          render={() => {
            throw new Error("boom");
          }}
        />
      </QuireProvider>
    );

    // Should fall back to raw text
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("uses custom render when provided", () => {
    const md = "## Test\ncontent";
    render(
      <QuireProvider content={md}>
        <SectionCard
          heading="Test"
          render={(content) => <span data-testid="custom">{content}</span>}
        />
      </QuireProvider>
    );

    expect(screen.getByTestId("custom")).toHaveTextContent("content");
  });
});

// ─── SectionTable (FR-016) ──────────────────────────────────────────────

describe("SectionTable (FR-016)", () => {
  const md = "## API\n| Method | Path |\n|---|---|\n| GET | /api |\n| POST | /users |";

  it("FR-016-AC-1: renders table from section", () => {
    render(
      <QuireProvider content={md}>
        <SectionTable heading="API" />
      </QuireProvider>
    );

    expect(screen.getByText("Method")).toBeInTheDocument();
    expect(screen.getByText("GET")).toBeInTheDocument();
    expect(screen.getByText("/api")).toBeInTheDocument();
  });

  it("FR-016-AC-2: returns null for empty table", () => {
    const noTable = "## Info\njust text";
    const { container } = render(
      <QuireProvider content={noTable}>
        <SectionTable heading="Info" />
      </QuireProvider>
    );

    expect(container.querySelector(".quire-section-table")).toBeNull();
  });

  it("FR-028-AC-2: cell renderer error falls back to raw text", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <QuireProvider content={md}>
        <SectionTable
          heading="API"
          cellRenderers={{
            Method: () => {
              throw new Error("cell boom");
            },
          }}
        />
      </QuireProvider>
    );

    // Should fall back to raw value
    expect(screen.getByText("GET")).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ─── SectionList (FR-017) ───────────────────────────────────────────────

describe("SectionList (FR-017)", () => {
  const md = "## Features\n- **Auth** — Token based\n- **Cache** — Redis layer";

  it("FR-017-AC-1: renders list items", () => {
    render(
      <QuireProvider content={md}>
        <SectionList heading="Features" />
      </QuireProvider>
    );

    expect(screen.getByText("Auth")).toBeInTheDocument();
    expect(screen.getByText("Token based")).toBeInTheDocument();
  });

  it("FR-017-AC-3: renders item icon", () => {
    render(
      <QuireProvider content={md}>
        <SectionList
          heading="Features"
          itemIcon={<span data-testid="bullet">•</span>}
        />
      </QuireProvider>
    );

    expect(screen.getAllByTestId("bullet")).toHaveLength(2);
  });

  it("returns null for missing section", () => {
    const { container } = render(
      <QuireProvider content={md}>
        <SectionList heading="Missing" />
      </QuireProvider>
    );

    expect(container.querySelector(".quire-section-list")).toBeNull();
  });
});

// ─── AutoSections (FR-018) ──────────────────────────────────────────────

describe("AutoSections (FR-018)", () => {
  const md = "## Purpose\npurpose content\n## Scope\nscope content\n## Frontmatter\nfm";

  it("FR-018-AC-1: renders all sections", () => {
    render(
      <QuireProvider content={md}>
        <AutoSections />
      </QuireProvider>
    );

    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(screen.getByText("Frontmatter")).toBeInTheDocument();
  });

  it("FR-018-AC-4: excludes specified sections", () => {
    render(
      <QuireProvider content={md}>
        <AutoSections exclude={["Frontmatter"]} />
      </QuireProvider>
    );

    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(screen.queryByText("fm")).not.toBeInTheDocument();
  });

  it("FR-018-AC-2: uses custom renderer", () => {
    render(
      <QuireProvider content={md}>
        <AutoSections
          renderers={{
            Purpose: (content) => <div data-testid="custom">{content}</div>,
          }}
        />
      </QuireProvider>
    );

    expect(screen.getByTestId("custom")).toHaveTextContent("purpose content");
  });

  it("FR-028-AC-3: catches renderer errors", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <QuireProvider content={md}>
        <AutoSections
          renderers={{
            Purpose: () => {
              throw new Error("render boom");
            },
          }}
        />
      </QuireProvider>
    );

    // Should fall back to raw text
    expect(screen.getByText("purpose content")).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
