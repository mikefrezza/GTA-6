import type { ReactNode } from "react";
import type { TrackId } from "../types";

function Glyph({
  size = 22,
  weight = 1.7,
  children,
}: {
  size?: number;
  weight?: number;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconHome() {
  return (
    <Glyph>
      <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-8.8Z" />
    </Glyph>
  );
}

export function IconBoard() {
  return (
    <Glyph>
      <path d="M8 4h8v3H8z" />
      <path d="M7 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <path d="M8.5 12.5h7M8.5 16h5" />
    </Glyph>
  );
}

export function IconTracks() {
  return (
    <Glyph>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
    </Glyph>
  );
}

export function IconDone() {
  return (
    <Glyph>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.2 12.2 11 15l4.8-5.2" />
    </Glyph>
  );
}

export function IconRank() {
  return (
    <Glyph>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 7.2 13.3 10.6h3.6l-2.9 2.1 1.1 3.4L12 14.1 8.9 16.1l1.1-3.4-2.9-2.1h3.6L12 7.2Z" />
    </Glyph>
  );
}

export function IconFlame() {
  return (
    <Glyph size={16} weight={1.8}>
      <path d="M12 3s.6 2.6.4 4.2c1-.8 1.8-2 1.8-2 1.2 1.8 2.3 3.2 2.3 6A4.5 4.5 0 1 1 8 12.2c.2-1.8 1.3-3 2.1-4.4C11 9 12 3 12 3Z" />
    </Glyph>
  );
}

export function IconPlus() {
  return (
    <Glyph size={28} weight={2.2}>
      <path d="M12 5v14M5 12h14" />
    </Glyph>
  );
}

export function IconPencil() {
  return (
    <Glyph size={18}>
      <path d="M4 20h4L18.5 9.5 14.5 5.5 4 16v4Z" />
      <path d="m13.2 6.8 4 4" />
    </Glyph>
  );
}

export function IconTrash() {
  return (
    <Glyph size={18}>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="m7.2 7 .8 12h8l.8-12" />
    </Glyph>
  );
}

export function IconChevron() {
  return (
    <Glyph size={18}>
      <path d="m9 6 6 6-6 6" />
    </Glyph>
  );
}

export function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <Glyph size={size} weight={2.2}>
      <path d="M5 12.2 9.4 16.5 19 7.5" />
    </Glyph>
  );
}

export function TrackIcon({ id, size = 20 }: { id: TrackId; size?: number }) {
  switch (id) {
    case "fitness":
      return (
        <Glyph size={size}>
          <path d="M3 12h3l2-5 3 10 2-5h8" />
        </Glyph>
      );
    case "health":
      return (
        <Glyph size={size}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" />
        </Glyph>
      );
    case "work":
      return (
        <Glyph size={size}>
          <rect x="3" y="8" width="18" height="11" rx="2" />
          <path d="M8 8V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V8" />
        </Glyph>
      );
    case "money":
      return (
        <Glyph size={size}>
          <ellipse cx="12" cy="8" rx="6.5" ry="2.5" />
          <path d="M5.5 8v6.2c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V8" />
          <path d="M5.5 11.1c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6" />
        </Glyph>
      );
    case "social":
      return (
        <Glyph size={size}>
          <circle cx="9" cy="9" r="2.2" />
          <circle cx="16" cy="10" r="1.8" />
          <path d="M4.8 18.2c.6-2.4 2.4-3.6 4.2-3.6s3.6 1.2 4.2 3.6" />
          <path d="M13.2 14.8c.8-.5 1.7-.8 2.7-.8 1.5 0 2.8.8 3.3 2.6" />
        </Glyph>
      );
    case "skills":
      return (
        <Glyph size={size}>
          <path d="M12 3.5 13.6 8H18l-3.6 2.8 1.4 4.5L12 12.6 8.2 15.3 9.6 10.8 6 8h4.4L12 3.5Z" />
        </Glyph>
      );
  }
}

export function CircuitGlyph({ name }: { name: string }) {
  switch (name) {
    case "Run":
      return (
        <Glyph size={18}>
          <circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" />
          <path d="M8 20 11 14l3 1 2-3-3-1-1.5 2L8 12" />
        </Glyph>
      );
    case "Lift":
      return (
        <Glyph size={18}>
          <path d="M4 12h16" />
          <path d="M7 9v6M17 9v6M5 10.2v3.6M19 10.2v3.6" />
        </Glyph>
      );
    case "Swim":
      return (
        <Glyph size={18}>
          <path d="M3 14c1.6-1.8 2.8-1.8 4.4 0s2.8 1.8 4.4 0 2.8-1.8 4.4 0 2.8 1.8 4.4 0" />
          <path d="M3 18c1.6-1.8 2.8-1.8 4.4 0s2.8 1.8 4.4 0 2.8-1.8 4.4 0 2.8 1.8 4.4 0" />
        </Glyph>
      );
    case "Stretch":
      return (
        <Glyph size={18}>
          <circle cx="8" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
          <path d="M8 8.5v4l6 2.2M8 11.2 5 14" />
        </Glyph>
      );
    case "Steps":
      return (
        <Glyph size={18}>
          <path d="M7 18c.2-2.2 1.2-3.4 3.2-3.4" />
          <circle cx="8" cy="9" r="1.5" />
          <path d="M13 19.2c.2-2.2 1.2-3.4 3.2-3.4" />
          <circle cx="14.2" cy="11" r="1.5" />
        </Glyph>
      );
    default:
      return (
        <Glyph size={18}>
          <path d="M15 4.5A6.5 6.5 0 1 0 19 14 5.2 5.2 0 0 1 15 4.5Z" />
        </Glyph>
      );
  }
}
