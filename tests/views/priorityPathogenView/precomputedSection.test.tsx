import { PrecomputedSection } from "@brc/views/PriorityPathogenView/components/PrecomputedSection/precomputedSection";
import type { PrecomputedResults } from "@catalog/schema/generated/schema";
import { createAppTheme } from "@databiosphere/findable-ui/lib/theme/theme";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
// jest-dom matchers aren't registered globally in this repo's jest config;
// opt in locally as the sibling view suites do.
import "@testing-library/jest-dom";

const WORKFLOW_TRS_ID =
  "#workflow/github.com/iwc-workflows/influenza-isolates-consensus-and-subtyping/main/versions/v0.5";

const RELEASE = {
  last_updated: "2026-10-28",
  manifest_url: "https://example.org/latest/manifest.json",
  record_count: 123,
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

describe("PrecomputedSection", () => {
  test("renders nothing when there is no precomputed block", () => {
    const { container } = renderThemed(<PrecomputedSection title="Results" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when there is no release", () => {
    const precomputed = {
      workflow_trs_id: WORKFLOW_TRS_ID,
    } as PrecomputedResults;
    const { container } = render(
      <PrecomputedSection precomputed={precomputed} title="Results" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders workflow link, last updated, record count and manifest link", () => {
    const precomputed = {
      release: RELEASE,
      workflow_trs_id: WORKFLOW_TRS_ID,
    } as PrecomputedResults;
    renderThemed(
      <PrecomputedSection precomputed={precomputed} title="Results" />
    );
    expect(screen.getByText("Results")).toBeInTheDocument();
    expect(screen.getByText("View workflow")).toHaveAttribute(
      "href",
      "/data/workflows/workflow-github-com-iwc-workflows-influenza-isolates-consensus-and-subtyping-main-versions-v0-5"
    );
    expect(screen.getByText("Last updated: 2026-10-28")).toBeInTheDocument();
    expect(screen.getByText("Records: 123")).toBeInTheDocument();
    expect(screen.getByText("Download manifest")).toHaveAttribute(
      "href",
      RELEASE.manifest_url
    );
  });

  test("omits the record count when absent", () => {
    const precomputed = {
      release: { ...RELEASE, record_count: undefined },
      workflow_trs_id: WORKFLOW_TRS_ID,
    } as PrecomputedResults;
    renderThemed(
      <PrecomputedSection precomputed={precomputed} title="Results" />
    );
    expect(screen.queryByText(/Records:/)).not.toBeInTheDocument();
  });
});
