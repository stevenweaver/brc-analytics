// Types for precomputed sequence segmentation results and coordinate barcode models.
// Aligned with catalog/py_package/catalog_build/schema/precomputed_results.yaml

export type CompendiumMatch = "EXACT" | "PARTIAL" | "NOVEL" | "UNRESOLVED";

export interface SegmentAlignment {
  coverage?: number;
  end: number;
  identity?: number;
  lineage_id?: string;
  segment_key: string;
  start: number;
}

export interface BarcodeInterval {
  ci_high?: number;
  ci_low?: number;
  n11?: number;
  n12?: number;
  n21?: number;
  n22?: number;
  p_fisher?: number;
  position: number;
}

export interface WorkflowProvenance {
  invocation_id: string;
  tool_version?: string;
  workflow_trs_id: string;
  workflow_version: string;
}

export interface PrecomputedResult {
  breakpoints?: BarcodeInterval[];
  compendium_match: CompendiumMatch;
  coordinate_barcode: string;
  provenance: WorkflowProvenance;
  segments?: SegmentAlignment[];
  sequence_id: string;
  structural_formula: string;
}

export interface PrecomputedResultsDataset {
  results: PrecomputedResult[];
}
