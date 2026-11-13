import { type PrecomputedResults } from "@brc/apis/precomputedResults";
import {
  BarcodeTrack,
  CompendiumMatchBadge,
} from "@brc/components/PrecomputedResults";
import { useShowPrecomputedResults } from "@brc/views/OrganismView/hooks/UseShowPrecomputedResults/hook";
import {
  ANCHOR_TARGET,
  REL_ATTRIBUTE,
} from "@databiosphere/findable-ui/lib/components/Links/common/entities";
import { BUTTON_PROPS } from "@databiosphere/findable-ui/lib/styles/common/mui/button";
import { TYPOGRAPHY_PROPS } from "@databiosphere/findable-ui/lib/styles/common/mui/typography";
import { DownloadRounded, ExpandMoreRounded } from "@mui/icons-material";
import { Button, Collapse, Link, Stack, Typography } from "@mui/material";
import { StyledSectionTitle } from "@repo/shared/views/OrganismView/components/Main/main.styles";
import { Fragment, type JSX, useState } from "react";
import {
  StyledCard,
  StyledDetails,
  StyledEyebrow,
  StyledMeta,
  StyledSummary,
} from "./precomputedResultsSection.styles";
import { type Props } from "./types";
import {
  formatAccessionRange,
  formatBytes,
  formatDate,
  getBioProjectUrl,
  getReferenceUrl,
} from "./utils";

const LINK_PROPS = {
  rel: REL_ATTRIBUTE.NO_OPENER_NO_REFERRER,
  target: ANCHOR_TARGET.BLANK,
};

// Galaxy pages linked from "How it was made", shown when the run published them.
const GALAXY_LINKS = [
  { key: "reportPageUrl", label: "Galaxy report" },
  { key: "historyUrl", label: "Galaxy history" },
] as const;

/**
 * Ready-to-use results section for the organism page. Each result is a card
 * that leads with what the data is and one download; what is inside and how it
 * was made are disclosed on request. Rendered under the Pangenome section.
 * Gated on the `demo` feature flag and the organism having precomputed
 * results — renders nothing otherwise.
 * @param props - Component props.
 * @param props.precomputedResults - The organism's precomputed results, when it has any.
 * @returns The section, or null when there is nothing to show.
 */
export const PrecomputedResultsSection = ({
  precomputedResults: precomputedResultsProp,
}: Props): JSX.Element | null => {
  const results = useShowPrecomputedResults(precomputedResultsProp);

  if (!results) return null;

  return (
    <>
      <StyledSectionTitle
        component="h2"
        id="precomputed-results"
        variant={TYPOGRAPHY_PROPS.VARIANT.HEADING_SMALL}
      >
        Ready-to-use results
      </StyledSectionTitle>
      <ResultCard results={results} />
    </>
  );
};

/**
 * One result: story and primary download, with details on request.
 * @param props - Component props.
 * @param props.results - The result to show.
 * @returns The card.
 */
function ResultCard({ results }: { results: PrecomputedResults }): JSX.Element {
  const [open, setOpen] = useState(false);
  const { bundle, inputs, provenance } = results;
  const { galaxy, invocations } = provenance;

  return (
    <StyledCard elevation={0}>
      <StyledSummary>
        <div>
          <StyledEyebrow>
            {results.kind}
            {provenance.dev && " · Preview"}
          </StyledEyebrow>
          <Typography
            component="h3"
            variant={TYPOGRAPHY_PROPS.VARIANT.HEADING_XSMALL}
          >
            {results.title}
          </Typography>
          <Typography variant={TYPOGRAPHY_PROPS.VARIANT.BODY_LARGE_400}>
            {results.description}
          </Typography>
          <StyledMeta>
            {inputs.runCount.toLocaleString("en-US")} samples · Galaxy workflow
            · Updated {formatDate(results.createDate)}
          </StyledMeta>
        </div>
        {bundle && (
          <div className="download">
            <Button
              color={BUTTON_PROPS.COLOR.PRIMARY}
              download
              href={bundle.url}
              size="large"
              startIcon={<DownloadRounded />}
              variant={BUTTON_PROPS.VARIANT.CONTAINED}
            >
              Download
            </Button>
            <StyledMeta>ZIP · {formatBytes(bundle.bytes)}</StyledMeta>
            {galaxy?.workflowUrl && (
              <Link className="run" href={galaxy.workflowUrl} {...LINK_PROPS}>
                Run it yourself in Galaxy
              </Link>
            )}
          </div>
        )}
      </StyledSummary>
      <Button
        aria-expanded={open}
        className="toggle"
        endIcon={<ExpandMoreRounded className={open ? "open" : undefined} />}
        onClick={() => setOpen((value) => !value)}
        variant={BUTTON_PROPS.VARIANT.TEXT}
      >
        {open ? "Hide details" : "What's inside and how it was made"}
      </Button>
      <Collapse in={open} unmountOnExit>
        <StyledDetails>
          <section>
            <Typography
              component="h4"
              variant={TYPOGRAPHY_PROPS.VARIANT.BODY_500}
            >
              What&apos;s inside
            </Typography>
            <dl>
              {results.outputs.map(({ description, files, label }) => (
                <Fragment key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {description}{" "}
                    <span className="files">
                      {files.map((file, i) => (
                        <Fragment key={file.path}>
                          {i > 0 && " · "}
                          <Link href={file.url} {...LINK_PROPS}>
                            {file.name}
                          </Link>
                        </Fragment>
                      ))}
                    </span>
                  </dd>
                </Fragment>
              ))}
            </dl>
          </section>
          {results.segmentationResults &&
            results.segmentationResults.length > 0 && (
              <section>
                <Typography
                  component="h4"
                  variant={TYPOGRAPHY_PROPS.VARIANT.BODY_500}
                >
                  Genomic architecture
                </Typography>
                <Stack spacing={2} useFlexGap>
                  {results.segmentationResults.map((result) => (
                    <Stack key={result.sequence_id} spacing={1} useFlexGap>
                      <Stack
                        alignItems="center"
                        direction="row"
                        flexWrap="wrap"
                        spacing={1}
                        useFlexGap
                      >
                        <Typography variant={TYPOGRAPHY_PROPS.VARIANT.BODY_500}>
                          {result.sequence_id}
                        </Typography>
                        <StyledMeta>{result.structural_formula}</StyledMeta>
                        <CompendiumMatchBadge match={result.compendium_match} />
                      </Stack>
                      <BarcodeTrack
                        breakpoints={result.breakpoints}
                        segments={result.segments}
                      />
                    </Stack>
                  ))}
                </Stack>
              </section>
            )}
          <section>
            <Typography
              component="h4"
              variant={TYPOGRAPHY_PROPS.VARIANT.BODY_500}
            >
              How it was made
            </Typography>
            <Typography variant={TYPOGRAPHY_PROPS.VARIANT.BODY_400_2_LINES}>
              Public sequencing reads from{" "}
              {inputs.studies.map(({ accession, description }, i) => (
                <Fragment key={accession}>
                  {i > 0 && ", "}
                  NCBI BioProject{" "}
                  <Link href={getBioProjectUrl(accession)} {...LINK_PROPS}>
                    {accession}
                  </Link>{" "}
                  ({description.replace(/\.$/, "")})
                </Fragment>
              ))}{" "}
              were processed by the Galaxy workflow{" "}
              <em>{provenance.workflowName}</em> (version{" "}
              {provenance.workflowVersion})
              {provenance.reference && (
                <>
                  , mapping reads to {provenance.reference.name} (GenBank{" "}
                  <Link
                    href={getReferenceUrl(provenance.reference)}
                    {...LINK_PROPS}
                  >
                    {formatAccessionRange(provenance.reference)}
                  </Link>
                  )
                </>
              )}
              .
            </Typography>
            <StyledMeta>
              {Object.entries(provenance.parameters)
                .filter(([key]) => key !== "Reference genome")
                .map(([key, value]) => `${key}: ${value}`)
                .join(" · ")}
              {" · "}Galaxy {provenance.galaxyVersion},{" "}
              {invocations ? (
                `${invocations.length} invocations`
              ) : (
                <>
                  invocation{" "}
                  {galaxy?.invocationUrl ? (
                    <Link href={galaxy.invocationUrl} {...LINK_PROPS}>
                      {provenance.invocationId}
                    </Link>
                  ) : (
                    provenance.invocationId
                  )}
                </>
              )}
              {galaxy &&
                GALAXY_LINKS.filter(({ key }) => galaxy[key]).map(
                  ({ key, label }) => (
                    <Fragment key={key}>
                      {" · "}
                      <Link href={galaxy[key] ?? undefined} {...LINK_PROPS}>
                        {label}
                      </Link>
                    </Fragment>
                  )
                )}
              {provenance.rocrateUrl && (
                <>
                  {" · "}
                  <Link href={provenance.rocrateUrl} {...LINK_PROPS}>
                    RO-Crate
                  </Link>
                </>
              )}
              {provenance.source && (
                <>
                  {" · "}
                  <Link
                    href={`${provenance.source.repoUrl}/tree/${provenance.source.commit}/${provenance.source.path}`}
                    {...LINK_PROPS}
                  >
                    Workflow source
                  </Link>
                </>
              )}
            </StyledMeta>
            {invocations && (
              <StyledMeta>
                Galaxy history for each batch of samples:{" "}
                {invocations.map(({ historyUrl, sampleCount }, i) => {
                  const label = `Batch ${i + 1}: ${sampleCount.toLocaleString("en-US")} samples`;
                  return (
                    <Fragment key={historyUrl ?? i}>
                      {i > 0 && " · "}
                      {historyUrl ? (
                        <Link
                          aria-label={label}
                          href={historyUrl}
                          title={label}
                          {...LINK_PROPS}
                        >
                          {i + 1}
                        </Link>
                      ) : (
                        i + 1
                      )}
                    </Fragment>
                  );
                })}
              </StyledMeta>
            )}
          </section>
        </StyledDetails>
      </Collapse>
    </StyledCard>
  );
}
