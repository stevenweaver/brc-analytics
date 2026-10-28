import { StyledList } from "@brc/views/PriorityPathogenView/components/ResourcesSection/resourcesSection.styles";
import { Section } from "@brc/views/PriorityPathogenView/ui/Section/section";
import { Link } from "@databiosphere/findable-ui/lib/components/Links/components/Link/link";
import { FluidPaper } from "@databiosphere/findable-ui/lib/components/common/Paper/components/FluidPaper/fluidPaper";
import { replaceParameters } from "@databiosphere/findable-ui/lib/utils/replaceParameters";
import { ListItem } from "@mui/material";
import { AppLink } from "@repo/shared/components/AppLink/appLink";
import { ROUTES } from "@repo/shared/routes/constants";
import { formatTrsId } from "@repo/shared/workflow/utils";
import { type JSX } from "react";
import type { Props } from "./types";

export const PrecomputedSection = ({
  precomputed,
  ...props /* Section Props */
}: Props): JSX.Element | null => {
  const release = precomputed?.release;
  if (!precomputed || !release) return null;
  return (
    <Section Paper={FluidPaper} {...props}>
      <StyledList disablePadding>
        <ListItem disableGutters disablePadding>
          <AppLink
            href={replaceParameters(ROUTES.WORKFLOW, {
              trsId: formatTrsId(precomputed.workflow_trs_id),
            })}
          >
            View workflow
          </AppLink>
        </ListItem>
        <ListItem disableGutters disablePadding>
          Last updated: {release.last_updated}
        </ListItem>
        {release.record_count != null && (
          <ListItem disableGutters disablePadding>
            Records: {release.record_count}
          </ListItem>
        )}
        <ListItem disableGutters disablePadding>
          <Link label="Download manifest" url={release.manifest_url} />
        </ListItem>
      </StyledList>
    </Section>
  );
};
