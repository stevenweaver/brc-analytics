import { type Pangenome } from "@brc/apis/pangenome";

import { type PrecomputedResults } from "@brc/apis/precomputedResults";

export interface Props {
  pangenome?: Pangenome;
  precomputedResults?: PrecomputedResults;
}
