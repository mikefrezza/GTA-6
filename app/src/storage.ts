import { clampXp } from "./game";
import type { Mission, MissionStatus, TrackId } from "./types";

const KEY = "night-rep.v1";

const TRACKS: TrackId[] = ["fitness", "health", "work", "money", "social", "skills"];

export type Persisted = {
  version: 1;
  missions: Mission[];
  bestStreak: number;
};

function isTrack(value: unknown): value is TrackId {
  return typeof value === "string" && TRACKS.includes(value as TrackId);
}

function sanitizeMission(input: unknown): Mission | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<Mission>;
  if (typeof raw.id !== "string" || !raw.id) return null;
  if (typeof raw.title !== "string" || !raw.title.trim()) return null;
  if (!isTrack(raw.track)) return null;
  const status: MissionStatus = raw.status === "done" ? "done" : "ready";
  const completedAt = Number(raw.completedAt);
  return {
    id: raw.id,
    title: raw.title.trim().slice(0, 64),
    track: raw.track,
    xp: clampXp(Number(raw.xp)),
    note: typeof raw.note === "string" ? raw.note.slice(0, 140) : "",
    status,
    starter: Boolean(raw.starter),
    createdAt: Number.isFinite(Number(raw.createdAt)) ? Number(raw.createdAt) : 0,
    completedAt: status === "done" && Number.isFinite(completedAt) && completedAt > 0 ? completedAt : null,
  };
}

export function loadState(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (parsed.version !== 1 || !Array.isArray(parsed.missions)) return null;
    const seen = new Set<string>();
    const missions: Mission[] = [];
    for (const item of parsed.missions) {
      const mission = sanitizeMission(item);
      if (!mission || seen.has(mission.id)) continue;
      seen.add(mission.id);
      missions.push(mission);
    }
    const best = Number(parsed.bestStreak);
    return { version: 1, missions, bestStreak: Number.isFinite(best) && best > 0 ? Math.floor(best) : 0 };
  } catch {
    return null;
  }
}

export function saveState(data: Persisted): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
