import { useShowPangenome } from "@brc/views/OrganismView/hooks/UseShowPangenome/hook";
import { useShowPrecomputedResults } from "@brc/views/OrganismView/hooks/UseShowPrecomputedResults/hook";
import { TabScrollFuzz } from "@databiosphere/findable-ui/lib/components/common/Tabs/tabs.styles";
import { BackPageTabs } from "@databiosphere/findable-ui/lib/components/Layout/components/BackPage/backPageView.styles";
import { useHash } from "@databiosphere/findable-ui/lib/components/Layout/components/Outline/hooks/UseHash/hook";
import { Tabs as MTabs, Tab } from "@mui/material";
import { useRouter } from "next/router";
import { type JSX } from "react";
import { TAB } from "./constants";
import { type Props } from "./types";
import { getActiveTab } from "./utils";

/**
 * Organism-page section tabs. The Pangenome tab is shown only when the
 * organism's species has a pangenome bundle to show — `useShowPangenome` owns
 * that decision, so this and the PangenomeSection gate identically.
 * @param props - Component props.
 * @param props.pangenome - The species' pangenome bundle, when it has one.
 * @param props.precomputedResults - The organism's precomputed results, when it has any.
 * @returns The organism-page tabs.
 */
export const Tabs = ({ pangenome, precomputedResults }: Props): JSX.Element => {
  const { hash } = useHash();
  const { push } = useRouter();
  const showPangenome = Boolean(useShowPangenome(pangenome));
  const showPrecomputedResults = Boolean(
    useShowPrecomputedResults(precomputedResults)
  );
  return (
    <BackPageTabs>
      <MTabs
        allowScrollButtonsMobile
        onChange={(_, v) => {
          push(`#${v}`);
        }}
        slots={{ scrollButtons: TabScrollFuzz }}
        value={getActiveTab(hash, showPangenome, showPrecomputedResults)}
      >
        <Tab label="Workflows" value={TAB.WORKFLOWS} />
        <Tab label="Assemblies" value={TAB.ASSEMBLIES} />
        {showPangenome && <Tab label="Pangenome" value={TAB.PANGENOME} />}
        {showPrecomputedResults && (
          <Tab label="Ready-to-use results" value={TAB.PRECOMPUTED_RESULTS} />
        )}
      </MTabs>
    </BackPageTabs>
  );
};
