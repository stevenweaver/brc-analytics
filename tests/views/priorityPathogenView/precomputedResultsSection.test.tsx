import type { PrecomputedResult } from "@brc/types/precomputedResults";
import { PrecomputedResultsSection } from "@brc/views/PriorityPathogenView/components/PrecomputedResultsSection/precomputedResultsSection";
import { createAppTheme } from "@databiosphere/findable-ui/lib/theme/theme";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
// jest-dom matchers aren't registered globally in this repo's jest config;
// opt in locally as the sibling view suites do.
import "@testing-library/jest-dom";

const FULL_RESULT: PrecomputedResult = {
  breakpoints: [{ p_fisher: 0.001, position: 400 }],
  compendium_match: "PARTIAL",
  coordinate_barcode: "1100",
  provenance: {
    invocation_id: "inv-001",
    workflow_trs_id:
      "#workflow/github.com/example/segmentation/main/versions/v1",
    workflow_version: "v1",
  },
  segments: [
    {
      coverage: 0.95,
      end: 400,
      identity: 0.99,
      lineage_id: "B3.13",
      segment_key: "PB2",
      start: 1,
    },
    { end: 800, segment_key: "PB1", start: 401 },
  ],
  sequence_id: "A/cattle/USA/26G14027-002/2026",
  structural_formula: "PB2:1-400+PB1:401-800",
};

const MINIMAL_RESULT: PrecomputedResult = {
  compendium_match: "NOVEL",
  coordinate_barcode: "0",
  provenance: {
    invocation_id: "inv-002",
    workflow_trs_id:
      "#workflow/github.com/example/segmentation/main/versions/v1",
    workflow_version: "v1",
  },
  sequence_id: "SEQ002",
  structural_formula: "unknown",
};

/**
 * Renders the element under the app theme the section's paper reads from.
 * @param element - Element to render.
 * @returns Render result.
 */
function renderThemed(element: ReactElement): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={createAppTheme()}>{element}</ThemeProvider>
  );
}

/**
 * Returns the text of every SVG tooltip in the rendered output.
 * @param container - Rendered container.
 * @returns Tooltip texts.
 */
function tooltipTexts(container: HTMLElement): (string | null)[] {
  return Array.from(container.querySelectorAll("title")).map(
    (title) => title.textContent
  );
}

describe("PrecomputedResultsSection", () => {
  test("renders per-sequence badges, segment labels and breakpoint tooltips", () => {
    const { container } = renderThemed(
      <PrecomputedResultsSection
        results={[FULL_RESULT, MINIMAL_RESULT]}
        title="Precomputed Segmentation Results"
      />
    );
    expect(
      screen.getByText("Precomputed Segmentation Results")
    ).toBeInTheDocument();
    expect(
      screen.getByText("A/cattle/USA/26G14027-002/2026")
    ).toBeInTheDocument();
    expect(screen.getByText("SEQ002")).toBeInTheDocument();
    expect(screen.getByText("PB2:1-400+PB1:401-800")).toBeInTheDocument();
    expect(screen.getByText("PARTIAL")).toBeInTheDocument();
    expect(screen.getByText("NOVEL")).toBeInTheDocument();
    expect(
      screen.getByText("PB2 · B3.13", { selector: "text" })
    ).toBeInTheDocument();
    expect(screen.getByText("PB1", { selector: "text" })).toBeInTheDocument();
    expect(tooltipTexts(container)).toContain("PB2 · B3.13");
    expect(tooltipTexts(container)).toContain("PB1");
    expect(tooltipTexts(container)).toContain("Position: 400, p_fisher: 0.001");
  });

  test("renders nothing when results are empty", () => {
    const { container } = renderThemed(
      <PrecomputedResultsSection results={[]} title="Results" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when results are omitted", () => {
    const { container } = renderThemed(
      <PrecomputedResultsSection title="Results" />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
