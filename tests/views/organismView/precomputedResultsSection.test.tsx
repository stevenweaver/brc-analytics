import type { PrecomputedResults } from "@brc/apis/precomputedResults";
import { PrecomputedResultsSection } from "@brc/views/OrganismView/components/Main/components/PrecomputedResultsSection/precomputedResultsSection";
import { createAppTheme } from "@databiosphere/findable-ui/lib/theme/theme";
import { ThemeProvider } from "@mui/material";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
// jest-dom matchers aren't registered globally in this repo's jest config;
// opt in locally as the sibling view suites do.
import "@testing-library/jest-dom";

const mockUseFeatureFlag = jest.fn<boolean, []>(() => true);

jest.mock(
  "@databiosphere/findable-ui/lib/hooks/useFeatureFlag/useFeatureFlag",
  () => ({ useFeatureFlag: (): boolean => mockUseFeatureFlag() })
);

const RESULTS: PrecomputedResults = {
  bundle: {
    bytes: 901215,
    name: "h5n1-dairy-cattle-genomes-and-genotypes-2026-11-05.zip",
    path: "h5n1-dairy-cattle-genomes-and-genotypes-2026-11-05.zip",
    sha256: "485106a65d58e02c1dea26672ef415dd417a72e6f2898e3e04ead",
    url: "https://files.example.test/h5n1/h5n1-dairy-cattle-genomes-and-genotypes-2026-11-05.zip",
  },
  createDate: "2026-11-05",
  description:
    "Consensus genomes for H5N1 samples from the dairy cattle outbreak.",
  id: "h5n1-fixed-reference-consensus-dev-2026-11-05",
  inputs: {
    runCount: 4960,
    studies: [
      {
        accession: "PRJNA1102327",
        description: "U.S. H5Nx dairy cattle emergence and spread",
        runCount: 4960,
      },
    ],
  },
  kind: "Workflow result",
  outputs: [
    {
      description: "One multi-FASTA per segment.",
      files: [
        {
          bytes: 8536205,
          name: "HA",
          path: "per-segment/HA.fasta",
          sha256: "aa",
          url: "https://files.example.test/h5n1/per-segment/HA.fasta",
        },
      ],
      label: "Genomes",
    },
  ],
  provenance: {
    dev: true,
    galaxy: {
      historyUrl: null,
      invocationUrl: null,
      reportPageUrl: null,
      version: "25.0.3",
      workflowUrl: "https://galaxy.example.test/published/workflow?id=abc",
    },
    galaxyVersion: "25.0.3",
    invocationId: "e38f593eae81d119",
    parameters: {
      Consensus: "ivar consensus: frequency 0.75, minimum depth 5",
      Genotyping: "RhizType multi-segment genotyper 0.1",
      Mapping: "bwa mem (defaults)",
    },
    reference: {
      accessions: ["PP755589.1", "PP755596.1"],
      name: "A/cattle/Texas/24-008749-003/2024 (H5N1)",
    },
    rocrateUrl: null,
    source: null,
    trsId: null,
    workflowName: "H5N1 fixed-reference consensus and genotyping",
    workflowVersion: "0.2-dev",
  },
  segmentationResults: [
    {
      breakpoints: [{ p_fisher: 0.01, position: 50 }],
      compendium_match: "EXACT",
      coordinate_barcode: "B3_13:1-100",
      provenance: {
        invocation_id: "e38f593eae81d119",
        workflow_trs_id: "example-workflow",
        workflow_version: "0.2-dev",
      },
      segments: [
        {
          end: 100,
          lineage_id: "B3_13",
          segment_key: "HA",
          start: 1,
        },
      ],
      sequence_id: "A/cattle/USA/26G14027-002/2026",
      structural_formula: "B3_13[3-1-10-7-2-3-5-4]",
    },
  ],
  speciesTaxonomyId: "2955291",
  title: "H5N1 in U.S. dairy cattle outbreak samples",
  version: "2026-11-05",
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

beforeEach(() => {
  mockUseFeatureFlag.mockReturnValue(true);
});

describe("PrecomputedResultsSection", () => {
  test("leads with the story and one primary download", () => {
    const { container } = renderThemed(
      <PrecomputedResultsSection precomputedResults={RESULTS} />
    );
    expect(screen.getByText("Ready-to-use results")).toBeInTheDocument();
    expect(
      screen.getByText("H5N1 in U.S. dairy cattle outbreak samples")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Consensus genomes for H5N1 samples from the dairy cattle outbreak."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/samples · Galaxy workflow · Updated/)
    ).toBeInTheDocument();
    const download = screen.getByRole("link", { name: /Download/ });
    expect(download).toHaveAttribute(
      "href",
      "https://files.example.test/h5n1/h5n1-dairy-cattle-genomes-and-genotypes-2026-11-05.zip"
    );
    expect(
      screen.getByRole("link", { name: "Run it yourself in Galaxy" })
    ).toHaveAttribute(
      "href",
      "https://galaxy.example.test/published/workflow?id=abc"
    );
    // Progressive disclosure: details stay hidden until requested.
    expect(screen.queryByText("What's inside")).not.toBeInTheDocument();
    expect(container.querySelector("svg text")).not.toBeInTheDocument();
  });

  test("discloses what's inside, how it was made and genomic architecture", async () => {
    const { container } = renderThemed(
      <PrecomputedResultsSection precomputedResults={RESULTS} />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "What's inside and how it was made" })
    );
    expect(await screen.findByText("What's inside")).toBeInTheDocument();
    expect(screen.getByText("How it was made")).toBeInTheDocument();
    expect(screen.getByText("Genomes")).toBeInTheDocument();
    expect(
      screen.getByText("One multi-FASTA per segment.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "HA" })).toHaveAttribute(
      "href",
      "https://files.example.test/h5n1/per-segment/HA.fasta"
    );
    expect(
      screen.getByText(/H5N1 fixed-reference consensus and genotyping/)
    ).toBeInTheDocument();
    expect(screen.getByText("Genomic architecture")).toBeInTheDocument();
    expect(
      screen.getByText("A/cattle/USA/26G14027-002/2026")
    ).toBeInTheDocument();
    expect(screen.getByText("B3_13[3-1-10-7-2-3-5-4]")).toBeInTheDocument();
    expect(screen.getByText("EXACT")).toBeInTheDocument();
    expect(
      screen.getByText("HA · B3_13", { selector: "text" })
    ).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("title")).map(
        (title) => title.textContent
      )
    ).toContain("Position: 50, p_fisher: 0.01");
    fireEvent.click(screen.getByRole("button", { name: "Hide details" }));
    expect(
      screen.getByRole("button", { name: "What's inside and how it was made" })
    ).toHaveAttribute("aria-expanded", "false");
  });

  test("renders nothing without precomputed results", () => {
    const { container } = renderThemed(<PrecomputedResultsSection />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when the demo flag is off", () => {
    mockUseFeatureFlag.mockReturnValue(false);
    const { container } = renderThemed(
      <PrecomputedResultsSection precomputedResults={RESULTS} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
