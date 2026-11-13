import type { CompendiumMatch } from "@brc/types/precomputedResults";
import type { ChipProps } from "@mui/material";
import { Chip } from "@mui/material";
import { type JSX } from "react";

export interface CompendiumMatchBadgeProps {
  className?: string;
  match: CompendiumMatch;
}

const MATCH_COLORS: Record<CompendiumMatch, ChipProps["color"]> = {
  EXACT: "success",
  NOVEL: "warning",
  PARTIAL: "info",
  UNRESOLVED: "default",
};

export const CompendiumMatchBadge = ({
  className,
  match,
}: CompendiumMatchBadgeProps): JSX.Element => {
  return (
    <Chip
      className={className}
      color={MATCH_COLORS[match]}
      label={match}
      size="small"
    />
  );
};
