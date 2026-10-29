import type { SectionProps } from "@brc/views/PriorityPathogenView/ui/Section/types";
import type { PrecomputedResults } from "@catalog/schema/generated/schema";
import type { Workflow } from "@repo/shared/apis/workflow";

export interface Props extends Omit<SectionProps, "children"> {
  precomputed?: PrecomputedResults;
  workflow?: Pick<Workflow, "iwcId" | "workflowDescription" | "workflowName">;
}
