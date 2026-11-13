import {
  type PrecomputedResults,
  type PrecomputedResultsCatalogEntry,
} from "@brc/apis/precomputedResults";

jest.mock("fs", () => ({ promises: { readFile: jest.fn() } }));

const BASE_URL = "https://files.example.test/precomputed";
const FILE = { bytes: 3, name: "HA", path: "seg/HA.fasta", sha256: "ab" };

const PRECOMPUTED: PrecomputedResultsCatalogEntry = {
  bundle: { bytes: 9, name: "all.zip", path: "all.zip", sha256: "cd" },
  createDate: "2026-10-29",
  description: "d",
  id: "x-v1",
  inputs: {
    runCount: 1,
    studies: [{ accession: "PRJNA0", description: "s", runCount: 1 }],
  },
  kind: "Workflow result",
  outputs: [{ description: "o", files: [FILE], label: "L" }],
  provenance: {
    dev: false,
    galaxy: null,
    galaxyVersion: "25.0",
    invocationId: "abc",
    parameters: {},
    rocrateUrl: null,
    source: null,
    trsId: null,
    workflowName: "wf",
    workflowVersion: "1",
  },
  releasePath: "species/2026-10-29/",
  speciesTaxonomyId: "2955291",
  title: "x",
  version: "2026-10-29",
};

const PRECOMPUTED_RESULTS_STATIC_LOAD_FILE =
  "catalog/output/precomputed-results.json";

const { releasePath: _releasePath, ...CATALOG_REST } = PRECOMPUTED;
const RESOLVED: PrecomputedResults = {
  ...CATALOG_REST,
  bundle: {
    bytes: 9,
    name: "all.zip",
    path: "all.zip",
    sha256: "cd",
    url: `${BASE_URL}/species/2026-10-29/all.zip`,
  },
  outputs: [
    {
      description: "o",
      files: [{ ...FILE, url: `${BASE_URL}/species/2026-10-29/seg/HA.fasta` }],
      label: "L",
    },
  ],
};

beforeEach(() => {
  process.env.PRECOMPUTED_RESULTS_BASE_URL = BASE_URL;
});

afterAll(() => {
  delete process.env.PRECOMPUTED_RESULTS_BASE_URL;
});

describe("loadPrecomputedResults", () => {
  test("keys the precomputedResults by species taxonomy ID", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    readFile.mockResolvedValue(JSON.stringify([PRECOMPUTED]));

    const precomputedResults = await loadPrecomputedResults();

    expect(readFile).toHaveBeenCalledWith(
      PRECOMPUTED_RESULTS_STATIC_LOAD_FILE,
      "utf8"
    );
    expect(precomputedResults.get("2955291")).toEqual(RESOLVED);
  });

  test.each(["", "/"])(
    "resolves URLs against a base with trailing slash %p",
    async (slashes) => {
      const { loadPrecomputedResults, readFile } = await freshModule();
      process.env.PRECOMPUTED_RESULTS_BASE_URL = BASE_URL + slashes;
      readFile.mockResolvedValue(JSON.stringify([PRECOMPUTED]));

      const result = (await loadPrecomputedResults()).get("2955291");

      expect(result?.bundle?.url).toBe(
        `${BASE_URL}/species/2026-10-29/all.zip`
      );
      expect(result?.outputs[0].files[0].url).toBe(
        `${BASE_URL}/species/2026-10-29/seg/HA.fasta`
      );
    }
  );

  test("uses a file's absolute url as-is and resolves the others", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    const url =
      "https://other.example.test/api/datasets/d1/display?to_ext=fasta";
    readFile.mockResolvedValue(
      JSON.stringify([
        {
          ...PRECOMPUTED,
          bundle: { ...PRECOMPUTED.bundle, url: `${url}&b=1` },
          outputs: [
            {
              description: "o",
              files: [
                { ...FILE, url },
                { ...FILE, name: "NA", path: "seg/NA.fasta" },
              ],
              label: "L",
            },
          ],
        },
      ])
    );

    const result = (await loadPrecomputedResults()).get("2955291");

    expect(result?.outputs[0].files.map((f) => f.url)).toEqual([
      url,
      `${BASE_URL}/species/2026-10-29/seg/NA.fasta`,
    ]);
    expect(result?.bundle?.url).toBe(`${url}&b=1`);
  });

  test("keeps a path prefix on a base without trailing slash", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    process.env.PRECOMPUTED_RESULTS_BASE_URL = "https://h.example.test/a/b";
    readFile.mockResolvedValue(JSON.stringify([PRECOMPUTED]));

    const result = (await loadPrecomputedResults()).get("2955291");

    expect(result?.bundle?.url).toBe(
      "https://h.example.test/a/b/species/2026-10-29/all.zip"
    );
  });

  test("passes galaxy provenance through", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    const galaxy = {
      historyUrl: "h",
      invocationUrl: null,
      reportPageUrl: null,
      version: "26.0",
      workflowUrl: null,
    };
    readFile.mockResolvedValue(
      JSON.stringify([
        { ...PRECOMPUTED, provenance: { ...PRECOMPUTED.provenance, galaxy } },
        { ...PRECOMPUTED, speciesTaxonomyId: "2" },
      ])
    );

    const results = await loadPrecomputedResults();

    expect(results.get("2955291")?.provenance.galaxy).toEqual(galaxy);
    expect(results.get("2")?.provenance.galaxy).toBeNull();
  });

  test("skips every entry with one warning when the base URL is unset", async () => {
    const { loadPrecomputedResults, readFile, warn } = await freshModule();
    delete process.env.PRECOMPUTED_RESULTS_BASE_URL;
    readFile.mockResolvedValue(JSON.stringify([PRECOMPUTED]));

    await expect(loadPrecomputedResults()).resolves.toEqual(new Map());
    await loadPrecomputedResults();

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("PRECOMPUTED_RESULTS_BASE_URL")
    );
  });

  test("memoizes the read across calls", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    readFile.mockResolvedValue(JSON.stringify([]));

    await Promise.all([loadPrecomputedResults(), loadPrecomputedResults()]);
    await loadPrecomputedResults();

    expect(readFile).toHaveBeenCalledTimes(1);
  });

  test("yields an empty map when the catalog is absent", async () => {
    const { loadPrecomputedResults, readFile, warn } = await freshModule();
    const error: NodeJS.ErrnoException = new Error("no such file");
    error.code = "ENOENT";
    readFile.mockRejectedValue(error);

    await expect(loadPrecomputedResults()).resolves.toEqual(new Map());
    // Loud: the section disappears from every organism page, so a silent
    // degrade would ship unnoticed.
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(PRECOMPUTED_RESULTS_STATIC_LOAD_FILE),
      error
    );
  });

  test("memoizes the absent catalog rather than retrying every page", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    const error: NodeJS.ErrnoException = new Error("no such file");
    error.code = "ENOENT";
    readFile.mockRejectedValue(error);

    await expect(loadPrecomputedResults()).resolves.toEqual(new Map());
    await expect(loadPrecomputedResults()).resolves.toEqual(new Map());

    // An absent catalog stays absent for the build, so re-reading it once per
    // page would buy nothing but ~2K failed reads.
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  test("fails when the payload is not an array", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    readFile.mockResolvedValue(
      JSON.stringify({ precomputedResults: [PRECOMPUTED] })
    );

    // A catalog that is present but the wrong shape is wrong data, not missing
    // data -- degrading would ship every organism page without its section.
    await expect(loadPrecomputedResults()).rejects.toThrow(
      `PrecomputedResults catalog is not an array: ${PRECOMPUTED_RESULTS_STATIC_LOAD_FILE}`
    );
  });

  test("fails when the payload is not valid JSON", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    readFile.mockResolvedValue("[{");

    await expect(loadPrecomputedResults()).rejects.toThrow();
  });

  test("fails when the catalog is unreadable for any other reason", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    const error: NodeJS.ErrnoException = new Error("permission denied");
    error.code = "EACCES";
    readFile.mockRejectedValue(error);

    await expect(loadPrecomputedResults()).rejects.toThrow("permission denied");
  });

  test("evicts a failed read so a transient error doesn't poison the worker", async () => {
    const { loadPrecomputedResults, readFile } = await freshModule();
    readFile.mockRejectedValueOnce(new Error("read failed"));
    readFile.mockResolvedValue(JSON.stringify([PRECOMPUTED]));

    await expect(loadPrecomputedResults()).rejects.toThrow("read failed");
    await expect(loadPrecomputedResults()).resolves.toEqual(
      new Map([["2955291", RESOLVED]])
    );
  });
});

/**
 * Re-imports the module under test so each case starts with an empty read memo
 * (the memo is module state, keyed by nothing but the module instance).
 * @returns The reader under test, the mocked readFile bound to it, and a
 * silenced console.warn spy.
 */
async function freshModule(): Promise<{
  loadPrecomputedResults: () => Promise<Map<string, PrecomputedResults>>;
  readFile: jest.Mock;
  warn: jest.SpyInstance;
}> {
  jest.resetModules();
  const { promises } = await import("fs");
  const { loadPrecomputedResults } =
    await import("@brc/services/staticGeneration/organism/precomputedResults");
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  return {
    loadPrecomputedResults,
    readFile: promises.readFile as jest.Mock,
    warn,
  };
}
