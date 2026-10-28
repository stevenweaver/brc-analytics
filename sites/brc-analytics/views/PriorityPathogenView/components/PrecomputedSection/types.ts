import type { SectionProps } from "@brc/views/PriorityPathogenView/ui/Section/types";
import type { PrecomputedResults } from "@catalog/schema/generated/schema";

export interface Props extends Omit<SectionProps, "children"> {
  precomputed?: PrecomputedResults;
}
