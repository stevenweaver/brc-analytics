import type {
  BarcodeInterval,
  SegmentAlignment,
} from "@brc/types/precomputedResults";
import { type JSX } from "react";

export interface BarcodeTrackProps {
  breakpoints?: BarcodeInterval[];
  className?: string;
  height?: number;
  segments?: SegmentAlignment[];
}

const VIEWBOX_WIDTH = 1000;
const SEGMENT_HEIGHT = 28;
const LABEL_FONT_SIZE = 11;

const SEGMENT_PALETTE: string[] = [
  "#1976d2",
  "#2e7d32",
  "#7b1fa2",
  "#e65100",
  "#00838f",
  "#c2185b",
  "#4e342e",
  "#283593",
  "#00695c",
  "#6a1b9a",
  "#ad1457",
  "#4527a0",
];

function segmentColorKey(segment: SegmentAlignment): string {
  return segment.lineage_id ?? segment.segment_key;
}

function segmentLabel(segment: SegmentAlignment): string {
  return segment.lineage_id
    ? `${segment.segment_key} · ${segment.lineage_id}`
    : segment.segment_key;
}

function breakpointTitle(breakpoint: BarcodeInterval): string {
  return breakpoint.p_fisher !== undefined
    ? `Position: ${breakpoint.position}, p_fisher: ${breakpoint.p_fisher}`
    : `Position: ${breakpoint.position}`;
}

export const BarcodeTrack = ({
  breakpoints = [],
  className,
  height = 80,
  segments = [],
}: BarcodeTrackProps): JSX.Element => {
  const positions: number[] = [
    ...segments.flatMap((segment) => [segment.start, segment.end]),
    ...breakpoints.map((breakpoint) => breakpoint.position),
  ];
  const domainMin = positions.length > 0 ? Math.min(...positions) : 0;
  const domainMax = positions.length > 0 ? Math.max(...positions) : 100;
  const domainSpan = domainMax - domainMin || 1;

  const toX = (position: number): number =>
    ((position - domainMin) / domainSpan) * VIEWBOX_WIDTH;

  const colorByKey = new Map<string, string>();
  for (const segment of segments) {
    const key = segmentColorKey(segment);
    if (!colorByKey.has(key)) {
      colorByKey.set(
        key,
        SEGMENT_PALETTE[colorByKey.size % SEGMENT_PALETTE.length]
      );
    }
  }

  const trackY = height / 2;
  const segmentY = trackY - SEGMENT_HEIGHT / 2;

  return (
    <svg
      aria-label="Coordinate barcode track"
      className={className}
      height={height}
      preserveAspectRatio="none"
      role="img"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${height}`}
      width="100%"
    >
      <line
        stroke="#9e9e9e"
        strokeWidth={1}
        x1={0}
        x2={VIEWBOX_WIDTH}
        y1={trackY}
        y2={trackY}
      />
      {segments.map((segment, index) => {
        const x = toX(segment.start);
        const width = Math.max(toX(segment.end) - x, 2);
        const fill =
          colorByKey.get(segmentColorKey(segment)) ?? SEGMENT_PALETTE[0];
        const label = segmentLabel(segment);
        const fitsInside = width >= 60;
        return (
          <g key={`${segment.segment_key}-${segment.start}-${index}`}>
            <title>{label}</title>
            <rect
              fill={fill}
              height={SEGMENT_HEIGHT}
              rx={3}
              width={width}
              x={x}
              y={segmentY}
            />
            <text
              dominantBaseline="middle"
              fill={fitsInside ? "#ffffff" : "#212121"}
              fontSize={LABEL_FONT_SIZE}
              textAnchor="middle"
              x={x + width / 2}
              y={fitsInside ? trackY : segmentY - LABEL_FONT_SIZE}
            >
              {label}
            </text>
          </g>
        );
      })}
      {breakpoints.map((breakpoint, index) => {
        const x = toX(breakpoint.position);
        return (
          <g key={`breakpoint-${breakpoint.position}-${index}`}>
            <title>{breakpointTitle(breakpoint)}</title>
            <line
              stroke="#d32f2f"
              strokeDasharray="4 2"
              strokeWidth={1.5}
              x1={x}
              x2={x}
              y1={4}
              y2={height - 4}
            />
            <circle cx={x} cy={4} fill="#d32f2f" r={3} />
          </g>
        );
      })}
    </svg>
  );
};
