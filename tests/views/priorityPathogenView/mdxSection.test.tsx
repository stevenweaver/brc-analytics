import { MDXSection } from "@brc/views/PriorityPathogenView/ui/Section/MDXSection/mdxSection";
import { createAppTheme } from "@databiosphere/findable-ui/lib/theme/theme";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { type MDXRemoteSerializeResult } from "next-mdx-remote";
import type { ReactElement } from "react";
import outbreaks from "../../../sites/brc-analytics/public/api/outbreaks.json";
// jest-dom matchers aren't registered globally in this repo's jest config;
// opt in locally as the sibling view suites do.
import "@testing-library/jest-dom";

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

describe("MDXSection", () => {
  test("renders the pre-compiled avian influenza description", () => {
    const avian = outbreaks.find(
      (outbreak) => outbreak.name === "Avian Influenza"
    );
    if (!avian) throw new Error("Avian Influenza entry missing from fixture");
    renderThemed(
      <MDXSection
        mdxRemoteSerializeResult={
          avian.description as unknown as MDXRemoteSerializeResult
        }
        title="Description"
      />
    );
    expect(
      screen.getByRole("heading", { name: "Overview" })
    ).toBeInTheDocument();
  });
});
