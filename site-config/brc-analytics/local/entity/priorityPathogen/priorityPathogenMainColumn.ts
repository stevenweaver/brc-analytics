import { type Outbreak } from "@brc/apis/outbreak";
import * as V from "@brc/viewModelBuilders/viewModelBuilders";
import { PrecomputedSection } from "@brc/views/PriorityPathogenView/components/PrecomputedSection/precomputedSection";
import { ResourcesSection } from "@brc/views/PriorityPathogenView/components/ResourcesSection/resourcesSection";
import { MDXSection } from "@brc/views/PriorityPathogenView/ui/Section/MDXSection/mdxSection";
import {
  type ComponentConfig,
  type ComponentsConfig,
} from "@databiosphere/findable-ui/lib/config/entities";

export const priorityPathogenMainColumn: ComponentsConfig = [
  {
    component: PrecomputedSection,
    viewBuilder: V.buildPriorityPathogenPrecomputed,
  } as ComponentConfig<typeof PrecomputedSection, Outbreak>,
  {
    component: MDXSection,
    viewBuilder: V.buildPriorityPathogenDescription,
  } as ComponentConfig<typeof MDXSection, Outbreak>,
  {
    component: ResourcesSection,
    viewBuilder: V.buildPriorityPathogenResources,
  } as ComponentConfig<typeof ResourcesSection, Outbreak>,
];
