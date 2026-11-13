import type { PrecomputedResults } from "@brc/apis/precomputedResults";
import { useFeatureFlag } from "@databiosphere/findable-ui/lib/hooks/useFeatureFlag/useFeatureFlag";
import { FEATURE_FLAGS } from "@repo/shared/config/featureFlags";

/**
 * Returns the precomputed results to show for a species — the given release
 * when the demo feature flag is enabled, otherwise undefined.
 * Single source of truth so the organism-page tab and the Ready-to-use results
 * section gate identically and can't drift.
 * @param precomputedResults - The species' precomputed results, when it has any.
 * @returns The precomputed results to show, or undefined.
 */
export function useShowPrecomputedResults(
  precomputedResults: PrecomputedResults | undefined
): PrecomputedResults | undefined {
  const isDemoEnabled = useFeatureFlag(FEATURE_FLAGS.DEMO);
  return isDemoEnabled ? precomputedResults : undefined;
}
