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
import { type ReleaseFile, useReleaseManifest } from "./useReleaseManifest";

/**
 * Formats a file link label with a human-readable size when known.
 * @param file - Release file.
 * @returns Link label.
 */
function fileLabel(file: ReleaseFile): string {
  if (file.bytes == null) return file.path;
  const kb = file.bytes / 1024;
  const size =
    kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  return `${file.path} (${size})`;
}

export const PrecomputedSection = ({
  precomputed,
  ...props /* Section Props */
}: Props): JSX.Element | null => {
  const release = precomputed?.release;
  const manifest = useReleaseManifest(release?.manifest_url ?? "");
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
          {manifest?.workflowVersion && ` (${manifest.workflowVersion})`}
        </ListItem>
        <ListItem disableGutters disablePadding>
          Last updated: {release.last_updated}
        </ListItem>
        {release.record_count != null && (
          <ListItem disableGutters disablePadding>
            Records: {release.record_count}
          </ListItem>
        )}
        {manifest && manifest.studies.length > 0 && (
          <ListItem disableGutters disablePadding>
            Studies: {manifest.studies.join(", ")}
          </ListItem>
        )}
        {manifest?.files.map((file) => (
          <ListItem key={file.path} disableGutters disablePadding>
            <Link label={fileLabel(file)} url={file.url} />
          </ListItem>
        ))}
        <ListItem disableGutters disablePadding>
          <Link label="Download manifest" url={release.manifest_url} />
        </ListItem>
      </StyledList>
    </Section>
  );
};
