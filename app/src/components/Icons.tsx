import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import { colors } from "../theme";
import type { TrackId } from "../types";

type IconProps = { size?: number; color?: string };

function stroke(color: string, weight: number) {
  return {
    stroke: color,
    strokeWidth: weight,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none" as const,
  };
}

export function IconHome({ size = 22, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-8.8Z" {...stroke(color, 1.7)} />
    </Svg>
  );
}

export function IconBoard({ size = 22, color = colors.ink }: IconProps) {
  const ink = stroke(color, 1.7);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 4h8v3H8z" {...ink} />
      <Path d="M7 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" {...ink} />
      <Path d="M8.5 12.5h7M8.5 16h5" {...ink} />
    </Svg>
  );
}

export function IconTracks({ size = 22, color = colors.ink }: IconProps) {
  const ink = stroke(color, 1.7);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={6.5} height={6.5} rx={1.4} {...ink} />
      <Rect x={13.5} y={4} width={6.5} height={6.5} rx={1.4} {...ink} />
      <Rect x={4} y={13.5} width={6.5} height={6.5} rx={1.4} {...ink} />
      <Rect x={13.5} y={13.5} width={6.5} height={6.5} rx={1.4} {...ink} />
    </Svg>
  );
}

export function IconDone({ size = 22, color = colors.ink }: IconProps) {
  const ink = stroke(color, 1.7);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={8} {...ink} />
      <Path d="M8.2 12.2 11 15l4.8-5.2" {...ink} />
    </Svg>
  );
}

export function IconRank({ size = 22, color = colors.ink }: IconProps) {
  const ink = stroke(color, 1.7);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={7.5} {...ink} />
      <Path d="M12 7.2 13.3 10.6h3.6l-2.9 2.1 1.1 3.4L12 14.1 8.9 16.1l1.1-3.4-2.9-2.1h3.6L12 7.2Z" {...ink} />
    </Svg>
  );
}

export function IconFlame({ size = 16, color = colors.gold }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3s.6 2.6.4 4.2c1-.8 1.8-2 1.8-2 1.2 1.8 2.3 3.2 2.3 6A4.5 4.5 0 1 1 8 12.2c.2-1.8 1.3-3 2.1-4.4C11 9 12 3 12 3Z"
        {...stroke(color, 1.8)}
      />
    </Svg>
  );
}

export function IconPlus({ size = 28, color = "#1a0b10" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" {...stroke(color, 2.2)} />
    </Svg>
  );
}

export function IconPencil({ size = 18, color = colors.dim }: IconProps) {
  const ink = stroke(color, 1.7);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 20h4L18.5 9.5 14.5 5.5 4 16v4Z" {...ink} />
      <Path d="m13.2 6.8 4 4" {...ink} />
    </Svg>
  );
}

export function IconTrash({ size = 18, color = colors.dim }: IconProps) {
  const ink = stroke(color, 1.7);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 7h14" {...ink} />
      <Path d="M9 7V5h6v2" {...ink} />
      <Path d="m7.2 7 .8 12h8l.8-12" {...ink} />
    </Svg>
  );
}

export function IconChevron({ size = 18, color = colors.dim }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="m9 6 6 6-6 6" {...stroke(color, 1.7)} />
    </Svg>
  );
}

export function IconCheck({ size = 16, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.2 9.4 16.5 19 7.5" {...stroke(color, 2.2)} />
    </Svg>
  );
}

export function TrackIcon({ id, size = 20, color = colors.ink }: { id: TrackId; size?: number; color?: string }) {
  const ink = stroke(color, 1.7);
  switch (id) {
    case "fitness":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12h3l2-5 3 10 2-5h8" {...ink} />
        </Svg>
      );
    case "health":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={8} {...ink} />
          <Path d="M12 8v8M8 12h8" {...ink} />
        </Svg>
      );
    case "work":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x={3} y={8} width={18} height={11} rx={2} {...ink} />
          <Path d="M8 8V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V8" {...ink} />
        </Svg>
      );
    case "money":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Ellipse cx={12} cy={8} rx={6.5} ry={2.5} {...ink} />
          <Path d="M5.5 8v6.2c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V8" {...ink} />
          <Path d="M5.5 11.1c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6" {...ink} />
        </Svg>
      );
    case "social":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={9} cy={9} r={2.2} {...ink} />
          <Circle cx={16} cy={10} r={1.8} {...ink} />
          <Path d="M4.8 18.2c.6-2.4 2.4-3.6 4.2-3.6s3.6 1.2 4.2 3.6" {...ink} />
          <Path d="M13.2 14.8c.8-.5 1.7-.8 2.7-.8 1.5 0 2.8.8 3.3 2.6" {...ink} />
        </Svg>
      );
    case "skills":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3.5 13.6 8H18l-3.6 2.8 1.4 4.5L12 12.6 8.2 15.3 9.6 10.8 6 8h4.4L12 3.5Z" {...ink} />
        </Svg>
      );
    case "partner":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19.2s-6.4-3.9-6.4-8.2A3.5 3.5 0 0 1 12 8.4a3.5 3.5 0 0 1 6.4 2.6c0 4.3-6.4 8.2-6.4 8.2Z" {...ink} />
        </Svg>
      );
  }
}

export function CircuitGlyph({ name, color = colors.ink }: { name: string; color?: string }) {
  const ink = stroke(color, 1.7);
  switch (name) {
    case "Run":
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Circle cx={15} cy={6} r={1.4} fill={color} />
          <Path d="M8 20 11 14l3 1 2-3-3-1-1.5 2L8 12" {...ink} />
        </Svg>
      );
    case "Lift":
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M4 12h16" {...ink} />
          <Path d="M7 9v6M17 9v6M5 10.2v3.6M19 10.2v3.6" {...ink} />
        </Svg>
      );
    case "Swim":
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M3 14c1.6-1.8 2.8-1.8 4.4 0s2.8 1.8 4.4 0 2.8-1.8 4.4 0 2.8 1.8 4.4 0" {...ink} />
          <Path d="M3 18c1.6-1.8 2.8-1.8 4.4 0s2.8 1.8 4.4 0 2.8-1.8 4.4 0 2.8 1.8 4.4 0" {...ink} />
        </Svg>
      );
    case "Stretch":
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Circle cx={8} cy={6.5} r={1.3} fill={color} />
          <Path d="M8 8.5v4l6 2.2M8 11.2 5 14" {...ink} />
        </Svg>
      );
    case "Steps":
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M7 18c.2-2.2 1.2-3.4 3.2-3.4" {...ink} />
          <Circle cx={8} cy={9} r={1.5} {...ink} />
          <Path d="M13 19.2c.2-2.2 1.2-3.4 3.2-3.4" {...ink} />
          <Circle cx={14.2} cy={11} r={1.5} {...ink} />
        </Svg>
      );
    default:
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M15 4.5A6.5 6.5 0 1 0 19 14 5.2 5.2 0 0 1 15 4.5Z" {...ink} />
        </Svg>
      );
  }
}

export function CheckMark({ on, tint }: { on: boolean; tint: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
      <Circle
        cx={16}
        cy={16}
        r={12}
        stroke={on ? tint : "rgba(255,255,255,0.28)"}
        strokeWidth={2}
        fill={on ? tint : "transparent"}
      />
      <Path
        d="M9.5 16.5 14 21l8.5-9.5"
        stroke={on ? "#1a0b10" : "transparent"}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
