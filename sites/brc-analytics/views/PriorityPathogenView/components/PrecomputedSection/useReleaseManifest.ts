import { useEffect, useState } from "react";

export interface ReleaseFile {
  bytes?: number;
  path: string;
  url: string;
}

export interface ReleaseManifest {
  files: ReleaseFile[];
  runs: number;
  studies: string[];
  thresholds: Record<string, number | string>;
  workflowVersion?: string;
}

/**
 * Fetches a release manifest client-side and resolves its file paths against the manifest URL.
 * Returns undefined until loaded, or if the manifest is unreachable or malformed.
 * @param manifestUrl - URL of the release manifest.json.
 * @returns Parsed manifest, or undefined.
 */
export function useReleaseManifest(
  manifestUrl: string
): ReleaseManifest | undefined {
  const [manifest, setManifest] = useState<ReleaseManifest>();

  useEffect(() => {
    if (typeof fetch === "undefined") return;
    let cancelled = false;
    fetch(manifestUrl)
      .then((res) => (res.ok ? res.json() : undefined))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.files)) return;
        setManifest({
          files: data.files.map((f: { bytes?: number; path: string }) => ({
            bytes: f.bytes,
            path: f.path,
            url: new URL(f.path, manifestUrl).href,
          })),
          runs: Array.isArray(data.runs) ? data.runs.length : 0,
          studies: Array.isArray(data.studies) ? data.studies : [],
          thresholds: data.thresholds ?? {},
          workflowVersion: data.workflow?.version,
        });
      })
      .catch(() => undefined);
    return (): void => {
      cancelled = true;
    };
  }, [manifestUrl]);

  return manifest;
}
