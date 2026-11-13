import {
  BarcodeTrack,
  CompendiumMatchBadge,
} from "@brc/components/PrecomputedResults";
import { Section } from "@brc/views/PriorityPathogenView/ui/Section/section";
import { FluidPaper } from "@databiosphere/findable-ui/lib/components/common/Paper/components/FluidPaper/fluidPaper";
import { Box, Stack, Typography } from "@mui/material";
import { type JSX } from "react";
import { type Props } from "./types";

export const PrecomputedResultsSection = ({
  results = [],
  ...props
}: Props): JSX.Element | null => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Section Paper={FluidPaper} {...props}>
      <Stack spacing={3}>
        {results.map((result) => (
          <Box key={result.sequence_id}>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle2">{result.sequence_id}</Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography color="text.secondary" variant="caption">
                  {result.structural_formula}
                </Typography>
                <CompendiumMatchBadge match={result.compendium_match} />
              </Stack>
            </Stack>
            <BarcodeTrack
              breakpoints={result.breakpoints}
              segments={result.segments}
            />
          </Box>
        ))}
      </Stack>
    </Section>
  );
};
