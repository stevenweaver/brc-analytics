// Base URL the pre-computed release manifests are served from, set per
// deployment via NEXT_PUBLIC_PRECOMPUTED_RELEASE_BASE_URL. The catalog records
// each release by path only, so the host stays deployment configuration rather
// than catalog data and no environment's host is baked into the repo.
const PRECOMPUTED_RELEASE_BASE_URL =
  process.env.NEXT_PUBLIC_PRECOMPUTED_RELEASE_BASE_URL;

/**
 * Resolves a catalog release manifest reference to a fetchable URL.
 *
 * A reference that is already absolute is returned unchanged, so a release
 * hosted elsewhere keeps its own URL. A relative reference resolves against
 * the configured base; with no base configured it resolves to undefined and
 * the caller renders nothing, which is the default state.
 * @param manifestRef - Manifest path from the catalog, or an absolute URL.
 * @returns Absolute manifest URL, or undefined when it cannot be resolved.
 */
export function getReleaseManifestUrl(
  manifestRef: string | undefined
): string | undefined {
  if (!manifestRef) return undefined;
  if (/^https?:\/\//i.test(manifestRef)) return manifestRef;
  const baseUrl = PRECOMPUTED_RELEASE_BASE_URL?.trim();
  if (!baseUrl) return undefined;
  return new URL(manifestRef, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`)
    .href;
}
