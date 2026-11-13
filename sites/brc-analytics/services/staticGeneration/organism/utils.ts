import { type BRCDataCatalogOrganism } from "@brc/apis/organism";
import { config } from "@brc/config/config";
import { makeWorkflowCategoriesAugmenter } from "@repo/shared/services/staticGeneration/workflows/utils";
import { loadPangenomes } from "./pangenomes";
import { loadPrecomputedResults } from "./precomputedResults";
import { type BRCOrganismDetail } from "./types";

// Bound once: the augmenter resolves the workflows catalog path on first use
// and keeps it, so the lookup doesn't re-run for every organism page.
const augmentWorkflowCategories =
  makeWorkflowCategoriesAugmenter<BRCDataCatalogOrganism>(config);

/**
 * Attaches the build-computed fields the organism detail page renders — the
 * organism's compatible workflow categories and (when present) its species
 * pangenome and precomputed results — so the page prerenders fully without the client entity store.
 * @param organism - Organism record.
 * @returns Organism detail data.
 */
export async function augmentOrganismDetail(
  organism: BRCDataCatalogOrganism
): Promise<BRCOrganismDetail> {
  // Read together: the three catalogs are independent, and this runs once per
  // organism page, so serializing them would add the pangenome read's latency
  // to every worker's first page for nothing.
  const [withWorkflowCategories, pangenomes, precomputedResults] =
    await Promise.all([
      augmentWorkflowCategories(organism),
      loadPangenomes(),
      loadPrecomputedResults(),
    ]);
  const pangenome = pangenomes.get(organism.ncbiTaxonomyId);
  const precomputed = precomputedResults.get(organism.ncbiTaxonomyId);
  // Spread the pangenome conditionally: getStaticProps output must be
  // JSON-serializable, and an explicit `undefined` field is not.
  return {
    ...withWorkflowCategories,
    ...(pangenome ? { pangenome } : {}),
    ...(precomputed ? { precomputedResults: precomputed } : {}),
  };
}
