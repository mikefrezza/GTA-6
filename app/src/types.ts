export type TrackId = "fitness" | "health" | "work" | "money" | "social" | "skills";

export type MissionStatus = "ready" | "done";

export type Mission = {
  id: string;
  title: string;
  track: TrackId;
  xp: number;
  note: string;
  status: MissionStatus;
  starter: boolean;
  createdAt: number;
  completedAt: number | null;
};

export type MissionDraft = {
  title: string;
  track: TrackId;
  xp: number;
  note: string;
};

export type TrackMeta = {
  id: TrackId;
  label: string;
  blurb: string;
  tint: string;
};

export type Rank = {
  name: string;
  min: number;
  max: number;
  line: string;
};

export type Preset = {
  title: string;
  note: string;
  xp: number;
  short: string;
};
