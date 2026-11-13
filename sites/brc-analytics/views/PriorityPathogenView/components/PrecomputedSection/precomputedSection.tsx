import { getReleaseManifestUrl } from "@brc/config/precomputedRelease";
import { StyledList } from "@brc/views/PriorityPathogenView/components/ResourcesSection/resourcesSection.styles";
import { Section } from "@brc/views/PriorityPathogenView/ui/Section/section";
import { Link } from "@databiosphere/findable-ui/lib/components/Links/components/Link/link";
import { FluidPaper } from "@databiosphere/findable-ui/lib/components/common/Paper/components/FluidPaper/fluidPaper";
import { TYPOGRAPHY_PROPS } from "@databiosphere/findable-ui/lib/styles/common/mui/typography";
import { replaceParameters } from "@databiosphere/findable-ui/lib/utils/replaceParameters";
import { ListItem, Stack, Typography } from "@mui/material";
import { AppLink } from "@repo/shared/components/AppLink/appLink";
import { ROUTES } from "@repo/shared/routes/constants";
import { formatTrsId } from "@repo/shared/workflow/utils";
import { type JSX } from "react";
import type { Props } from "./types";
import { type ReleaseFile, useReleaseManifest } from "./useReleaseManifest";

const TRS_VERSION_RE = /\/versions\/([^/]+)$/;

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
  workflow,
  ...props /* Section Props */
}: Props): JSX.Element | null => {
  const release = precomputed?.release;
  const manifestUrl = getReleaseManifestUrl(release?.manifest_url);
  const manifest = useReleaseManifest(manifestUrl ?? "");
  if (!precomputed || !release) return null;
  const version =
    manifest?.workflowVersion ??
    TRS_VERSION_RE.exec(precomputed.workflow_trs_id)?.[1];
  const thresholds = Object.entries(manifest?.thresholds ?? {});
  return (
    <Section Paper={FluidPaper} {...props}>
      <Stack gap={2}>
        <Stack gap={1}>
          <Typography
            color={TYPOGRAPHY_PROPS.COLOR.INK_LIGHT}
            variant={TYPOGRAPHY_PROPS.VARIANT.BODY_SMALL_400}
          >
            Produced by Galaxy workflow
          </Typography>
          <Typography variant={TYPOGRAPHY_PROPS.VARIANT.BODY_LARGE_500}>
            {workflow?.workflowName ?? "Galaxy workflow"}
            {version && ` (${version})`}
          </Typography>
          {workflow?.workflowDescription && (
            <Typography variant={TYPOGRAPHY_PROPS.VARIANT.BODY_400_2_LINES}>
              {workflow.workflowDescription}
            </Typography>
          )}
          <Typography variant={TYPOGRAPHY_PROPS.VARIANT.BODY_400}>
            <AppLink
              href={replaceParameters(ROUTES.WORKFLOW, {
                trsId: formatTrsId(precomputed.workflow_trs_id),
              })}
            >
              View workflow
            </AppLink>
            {workflow?.iwcId && (
              <>
                {" · "}
                <Link
                  label="IWC page"
                  url={`https://iwc.galaxyproject.org/workflow/${workflow.iwcId}`}
                />
              </>
            )}
          </Typography>
          {thresholds.length > 0 && (
            <Typography
              color={TYPOGRAPHY_PROPS.COLOR.INK_LIGHT}
              variant={TYPOGRAPHY_PROPS.VARIANT.BODY_SMALL_400}
            >
              Parameters:{" "}
              {thresholds.map(([key, value]) => `${key}=${value}`).join(", ")}
            </Typography>
          )}
        </Stack>
        <StyledList disablePadding>
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
          {manifestUrl && (
            <ListItem disableGutters disablePadding>
              <Link label="Download manifest" url={manifestUrl} />
            </ListItem>
          )}
        </StyledList>
      </Stack>
    </Section>
  );
};
