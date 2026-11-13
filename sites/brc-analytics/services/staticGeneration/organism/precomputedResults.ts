import {
  type PrecomputedResults,
  type PrecomputedResultsCatalogEntry,
  type PrecomputedResultsCatalogFile,
} from "@brc/apis/precomputedResults";
import { promises as fsp } from "fs";

// The precomputedResults catalog, read at build time and embedded into each organism
// page. Repo-root-relative: site builds run from the repo root. Not a site
// config entry: config entities describe the site's pages, and precomputedResults have
// no page of their own -- they are a section of the organism page.
const PRECOMPUTED_RESULTS_STATIC_LOAD_FILE =
  "catalog/output/precomputed-results.json";

// Server-side, build-time base URL of the hosted release files. The catalog
// holds paths only; with no base URL set, no entry can be resolved and the
// section stays off.
const PRECOMPUTED_RESULTS_BASE_URL_ENV = "PRECOMPUTED_RESULTS_BASE_URL";

let precomputedResultsPromise: Promise<Map<string, PrecomputedResults>> | null =
  null;

/**
 * Reads the precomputedResults catalog into a map keyed by species taxonomy ID,
 * with file URLs resolved against PRECOMPUTED_RESULTS_BASE_URL. Without that
 * variable every entry is skipped (one warning), so the feature is off by
 * default. Memoized per build worker so the per-page lookup is O(1). An absent
 * catalog warns and yields an empty map rather than failing the build: no catalog build
 * step writes this file yet, so a clean catalog/output has no precomputedResults to
 * read, and an organism page without its precomputedResults section is the page the site
 * served before the section existed. A catalog that is present but unusable is
 * a different case and fails the build -- it means the data is wrong rather
 * than missing, and degrading would ship every organism page without its
 * precomputedResults section on a green build.
 * @returns PrecomputedResults keyed by species taxonomy ID, empty where absent.
 */
export function loadPrecomputedResults(): Promise<
  Map<string, PrecomputedResults>
> {
  if (!precomputedResultsPromise) {
    const baseUrl = process.env[PRECOMPUTED_RESULTS_BASE_URL_ENV]?.trim();
    if (!baseUrl) {
      console.warn(
        `[precomputedResults] ${PRECOMPUTED_RESULTS_BASE_URL_ENV} is not set; organism pages will build without their precomputedResults section.`
      );
      precomputedResultsPromise = Promise.resolve(
        new Map<string, PrecomputedResults>()
      );
      return precomputedResultsPromise;
    }
    const promise = fsp
      .readFile(PRECOMPUTED_RESULTS_STATIC_LOAD_FILE, "utf8")
      .then((text) => {
        const precomputedResults = JSON.parse(
          text
        ) as PrecomputedResultsCatalogEntry[];
        if (!Array.isArray(precomputedResults))
          throw new Error(
            `PrecomputedResults catalog is not an array: ${PRECOMPUTED_RESULTS_STATIC_LOAD_FILE}`
          );
        return new Map(
          precomputedResults.map((p) => [
            p.speciesTaxonomyId,
            resolvePrecomputedResults(p, baseUrl),
          ])
        );
      })
      .catch((error) => {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        // Loud: every organism page silently losing its precomputedResults section is
        // the kind of regression that ships unnoticed.
        console.warn(
          `[precomputedResults] ${PRECOMPUTED_RESULTS_STATIC_LOAD_FILE} not found; organism pages will build without their precomputedResults section.`,
          error
        );
        return new Map<string, PrecomputedResults>();
      });
    // Don't cache a failed read — evict on rejection so a transient error
    // doesn't poison every subsequent page render in the same worker. An absent
    // catalog resolves rather than rejects, so it stays memoized.
    promise.catch(() => (precomputedResultsPromise = null));
    precomputedResultsPromise = promise;
  }
  return precomputedResultsPromise;
}

/**
 * Resolves a catalog entry's relative file paths to absolute URLs; a file
 * that already has an absolute `url` keeps it.
 * @param entry - Catalog entry.
 * @param baseUrl - Base URL of the hosted release files; trailing slash optional.
 * @returns The entry with `url` on its bundle and files, without `releasePath`.
 */
export function resolvePrecomputedResults(
  entry: PrecomputedResultsCatalogEntry,
  baseUrl: string
): PrecomputedResults {
  const { bundle, releasePath, ...rest } = entry;
  const releaseUrl = new URL(
    releasePath,
    baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
  );
  const withUrl = <T extends PrecomputedResultsCatalogFile>(
    file: T
  ): T & { url: string } => ({
    ...file,
    url: file.url ?? new URL(file.path, releaseUrl).href,
  });
  return {
    ...rest,
    ...(bundle && { bundle: withUrl(bundle) }),
    outputs: entry.outputs.map((o) => ({ ...o, files: o.files.map(withUrl) })),
  };
}
