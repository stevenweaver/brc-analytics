import { Fragment } from "react";
import { FILL, GRID_SIZE } from "../../../../../../../Hero/common/constants";
import { ELEMENT_ID, Height } from "../../../../../../../Hero/common/entities";
import {
  getElementHref,
  getFillUrl,
  getViewBox,
} from "../../../../../../../Hero/common/utils";
import { CoralPinkCircle } from "../../../../../../../Hero/components/Defs/CoralPinkCircle/coralPinkCircle";
import { SmokeCircle } from "../../../../../../../Hero/components/Defs/SmokeCircle/smokeCircle";
import { SmokeRect } from "../../../../../../../Hero/components/Defs/SmokeRect/smokeRect";
import { YellowRect } from "../../../../../../../Hero/components/Defs/YellowRect/yellowRect";

export interface HeroProps {
  gridSize?: number;
  height?: Height;
}

export const Hero = ({
  gridSize = GRID_SIZE,
  height = GRID_SIZE * 1.5,
}: HeroProps): JSX.Element => {
  return (
    <svg
      fill={FILL.NONE}
      height={height}
      preserveAspectRatio="xMinYMin meet"
      viewBox={getViewBox(gridSize, height)}
      width="100vw"
      xmlns="http://www.w3.org/2000/svg"
    >
      <SmokeRect gridSize={gridSize} />
      <SmokeCircle gridSize={gridSize} />
      <YellowRect gridShift={3} gridSize={gridSize} />
      <CoralPinkCircle gridSize={gridSize} />
      {[
        ELEMENT_ID.PATTERN_SMOKE_RECT,
        ELEMENT_ID.PATTERN_YELLOW_RECT,
        ELEMENT_ID.PATTERN_SMOKE_CIRCLE,
      ].map((elementId) => (
        <Fragment key={elementId}>
          <rect
            fill={getFillUrl(elementId)}
            height={height}
            width="100vw"
            x={0}
            y={0}
          />
        </Fragment>
      ))}
      <use href={getElementHref(ELEMENT_ID.GROUP_CORAL_PINK_CIRLCLE)} />
    </svg>
  );
};
