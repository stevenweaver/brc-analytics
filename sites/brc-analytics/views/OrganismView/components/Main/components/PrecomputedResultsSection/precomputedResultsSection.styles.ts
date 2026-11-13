import { FluidPaper } from "@databiosphere/findable-ui/lib/components/common/Paper/components/FluidPaper/fluidPaper";
import { FONT } from "@databiosphere/findable-ui/lib/styles/common/constants/font";
import { PALETTE } from "@databiosphere/findable-ui/lib/styles/common/constants/palette";
import styled from "@emotion/styled";

export const StyledCard = styled(FluidPaper)`
  display: grid;
  gap: 4px;
  padding: 20px 24px 12px;

  .toggle {
    justify-self: start;
    text-transform: none;

    .MuiSvgIcon-root {
      transition: transform 200ms;

      &.open {
        transform: rotate(180deg);
      }
    }
  }
`;

export const StyledSummary = styled.div`
  align-items: start;
  display: grid;
  gap: 16px 32px;
  grid-template-columns: 1fr auto;

  > div:first-of-type {
    display: grid;
    gap: 6px;
  }

  .download {
    display: grid;
    gap: 4px;
    justify-items: center;

    .run {
      font: ${FONT.BODY_SMALL_400};
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;

    .download {
      justify-items: start;
    }
  }
`;

export const StyledEyebrow = styled.span`
  color: ${PALETTE.INK_LIGHT};
  font: ${FONT.BODY_SMALL_500};
  letter-spacing: 0.75px;
  text-transform: uppercase;
`;

export const StyledMeta = styled.span`
  color: ${PALETTE.INK_LIGHT};
  font: ${FONT.BODY_SMALL_400_2_LINES};
`;

export const StyledDetails = styled.div`
  border-top: 1px solid ${PALETTE.SMOKE_MAIN};
  display: grid;
  gap: 20px;
  margin-top: 8px;
  padding: 16px 0 12px;

  section {
    display: grid;
    gap: 8px;
  }

  dl {
    display: grid;
    gap: 8px 24px;
    grid-template-columns: max-content 1fr;
    margin: 0;
  }

  dt {
    font: ${FONT.BODY_500};
  }

  dd {
    font: ${FONT.BODY_400_2_LINES};
    margin: 0;
  }

  @media (max-width: 640px) {
    dl {
      grid-template-columns: 1fr;
    }

    dd {
      margin-bottom: 8px;
    }
  }

  .files {
    font: ${FONT.BODY_SMALL_400};
    white-space: nowrap;
  }
`;
