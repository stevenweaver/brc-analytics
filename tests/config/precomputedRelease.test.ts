const BASE_URL_ENV = "NEXT_PUBLIC_PRECOMPUTED_RELEASE_BASE_URL";
const MANIFEST_PATH = "avian-influenza--release/2026-10-28/manifest.json";

/**
 * Loads the module fresh so it re-reads the env var, which it captures at
 * module scope the way the other NEXT_PUBLIC config modules do.
 * @param baseUrl - Value for the base URL env var, or undefined to unset it.
 * @returns The module's getReleaseManifestUrl.
 */
async function loadResolver(
  baseUrl: string | undefined
): Promise<(manifestRef: string | undefined) => string | undefined> {
  if (baseUrl === undefined) delete process.env[BASE_URL_ENV];
  else process.env[BASE_URL_ENV] = baseUrl;
  jest.resetModules();
  const { getReleaseManifestUrl } =
    await import("@brc/config/precomputedRelease");
  return getReleaseManifestUrl;
}

describe("getReleaseManifestUrl", () => {
  const originalEnv = process.env[BASE_URL_ENV];

  afterEach(() => {
    if (originalEnv === undefined) delete process.env[BASE_URL_ENV];
    else process.env[BASE_URL_ENV] = originalEnv;
  });

  it("resolves a relative manifest path against the configured base URL", async () => {
    expect(
      (await loadResolver("https://files.example.org/precomputed"))(
        MANIFEST_PATH
      )
    ).toBe(`https://files.example.org/precomputed/${MANIFEST_PATH}`);
  });

  it("resolves the same way when the base URL has a trailing slash", async () => {
    expect(
      (await loadResolver("https://files.example.org/precomputed/"))(
        MANIFEST_PATH
      )
    ).toBe(`https://files.example.org/precomputed/${MANIFEST_PATH}`);
  });

  it("returns an absolute manifest URL unchanged, with no base URL configured", async () => {
    expect(
      (await loadResolver(undefined))(
        "https://elsewhere.example.org/manifest.json"
      )
    ).toBe("https://elsewhere.example.org/manifest.json");
  });

  it("returns undefined for a relative path when no base URL is configured", async () => {
    expect((await loadResolver(undefined))(MANIFEST_PATH)).toBeUndefined();
    expect((await loadResolver("   "))(MANIFEST_PATH)).toBeUndefined();
  });

  it("returns undefined for a missing manifest reference", async () => {
    expect(
      (await loadResolver("https://files.example.org"))(undefined)
    ).toBeUndefined();
    expect(
      (await loadResolver("https://files.example.org"))("")
    ).toBeUndefined();
  });
});
