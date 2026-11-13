import type { PrecomputedResult } from "@brc/types/precomputedResults";
import type { SectionProps } from "@brc/views/PriorityPathogenView/ui/Section/types";

export interface Props extends Omit<SectionProps, "children"> {
  results?: PrecomputedResult[];
}
