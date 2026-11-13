import { type PrecomputedResult } from "@brc/types/precomputedResults";

/**
 * A release as stored in the precomputed results catalog: files are located by
 * path relative to the release's `releasePath`, so the catalog names no host.
 */
export interface PrecomputedResultsCatalogEntry extends Omit<
  PrecomputedResults,
  "bundle" | "outputs"
> {
  bundle?: PrecomputedResultsCatalogFile;
  outputs: PrecomputedResultsCatalogOutput[];
  /** Directory of the release's files, relative to the download base URL. */
  releasePath: string;
}

/**
 * A downloadable file in the catalog, located by path within the release, or
 * by an absolute `url` where the file is hosted elsewhere.
 */
export interface PrecomputedResultsCatalogFile {
  bytes: number;
  name: string;
  path: string;
  sha256: string;
  /** Absolute download URL; used as-is instead of resolving `path`. */
  url?: string;
}

/**
 * An output of a catalog release.
 */
export interface PrecomputedResultsCatalogOutput extends Omit<
  PrecomputedResultsOutput,
  "files"
> {
  files: PrecomputedResultsCatalogFile[];
}

/**
 * A precomputed-results release for a species, with download URLs resolved
 * from the catalog at build time and embedded in the organism page's static
 * props for the Pre-computed results section.
 */
export interface PrecomputedResults {
  /** Single archive of every output, offered as the primary download. */
  bundle?: PrecomputedResultsBundle;
  createDate: string;
  /** One or two sentences on what the data is and what it shows. */
  description: string;
  id: string;
  inputs: PrecomputedResultsInputs;
  /** Kind of result, e.g. "Workflow result" or "Curated dataset". */
  kind: string;
  outputs: PrecomputedResultsOutput[];
  provenance: PrecomputedResultsProvenance;
  /** Per-sequence segmentation results, when the release ships them. */
  segmentationResults?: PrecomputedResult[];
  speciesTaxonomyId: string;
  title: string;
  /** Release date string. */
  version: string;
}

/**
 * An archive bundling a release's output files unchanged.
 */
export interface PrecomputedResultsBundle extends PrecomputedResultsCatalogFile {
  url: string;
}

/**
 * A downloadable output file of a release. The name is the short link text,
 * e.g. the segment for per-segment files, otherwise the filename.
 */
export interface PrecomputedResultsFile extends PrecomputedResultsCatalogFile {
  url: string;
}

/**
 * The input datasets a release was computed from.
 */
export interface PrecomputedResultsInputs {
  runCount: number;
  studies: PrecomputedResultsStudy[];
}

/**
 * An output of a release: one data type, delivered as one or more files.
 */
export interface PrecomputedResultsOutput {
  description: string;
  files: PrecomputedResultsFile[];
  label: string;
}

/**
 * One Galaxy invocation of a release that merges several.
 */
export interface PrecomputedResultsInvocation {
  historyUrl: string | null;
  sampleCount: number;
}

/**
 * How a release was produced: the Galaxy workflow, its source, and the
 * invocation that ran it.
 */
export interface PrecomputedResultsProvenance {
  dev: boolean;
  /** Links to the run on the Galaxy instance that produced it, if known. */
  galaxy: PrecomputedResultsGalaxy | null;
  galaxyVersion: string;
  invocationId: string;
  /** Each Galaxy invocation, when the release merges more than one. */
  invocations?: PrecomputedResultsInvocation[];
  parameters: Record<string, string>;
  reference?: PrecomputedResultsReference;
  rocrateUrl: string | null;
  source: PrecomputedResultsSource | null;
  trsId: string | null;
  workflowName: string;
  workflowVersion: string;
}

/**
 * Where the run lives on the Galaxy instance it ran on, as recorded by the
 * pipeline. Links are null where not published.
 */
export interface PrecomputedResultsGalaxy {
  historyUrl: string | null;
  invocationUrl: string | null;
  reportPageUrl: string | null;
  version: string;
  workflowUrl: string | null;
}

/**
 * Git location of the workflow definition.
 */
export interface PrecomputedResultsSource {
  branch: string;
  commit: string;
  path: string;
  repoUrl: string;
}

/**
 * Reference genome the reads were mapped to, with its GenBank accessions.
 */
export interface PrecomputedResultsReference {
  accessions: string[];
  name: string;
}

/**
 * A BioProject whose runs were used as input.
 */
export interface PrecomputedResultsStudy {
  accession: string;
  description: string;
  runCount: number;
}
