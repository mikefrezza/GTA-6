import type { Mission, Rank, TrackId } from "./types";

const MAX_LEVEL = 99;

const RANK_DEFS: Array<Omit<Rank, "max">> = [
  { min: 1, name: "Night Spark", line: "You showed up. That is the whole rank." },
  { min: 3, name: "Block Runner", line: "A pace the rest of the week can feel." },
  { min: 5, name: "Circuit Regular", line: "This is a habit, not a guest spot." },
  { min: 8, name: "Signal Operator", line: "You run the night instead of reacting to it." },
  { min: 12, name: "District Ace", line: "Your days have a signature now." },
  { min: 17, name: "Skyline Lead", line: "The long reps are where you live." },
  { min: 23, name: "Metro Vanguard", line: "Loud weeks do not move you off the board." },
  { min: 30, name: "Aurora Prime", line: "The work is quiet. The rank is not." },
  { min: 40, name: "Lantern Captain", line: "Consistency, with a skyline attached." },
  { min: 60, name: "Night Sovereign", line: "The board answers when you do." },
  { min: 99, name: "Apex Signal", line: "Nothing left to prove. You do it anyway." },
];

export function getRanks(): Rank[] {
  return RANK_DEFS.map((rank, index) => ({
    ...rank,
    max: index === RANK_DEFS.length - 1 ? MAX_LEVEL : RANK_DEFS[index + 1].min - 1,
  }));
}

export function rankFor(level: number): Rank {
  const ranks = getRanks();
  let current = ranks[0];
  for (const rank of ranks) {
    if (level >= rank.min) current = rank;
  }
  return current;
}

export function nextRank(level: number): { name: string; levelsAway: number } | null {
  const next = getRanks().find((rank) => rank.min > level);
  if (!next) return null;
  return { name: next.name, levelsAway: next.min - level };
}

/** Early levels turn over fast. Later levels ask for a longer board. */
export function xpToAdvance(level: number): number {
  const safe = Math.max(1, Math.min(MAX_LEVEL, level));
  return Math.round(36 * Math.pow(safe, 1.48) + 20 * safe);
}

export type LevelProgress = {
  level: number;
  into: number;
  need: number;
  ratio: number;
};

export function levelFromXp(total: number): LevelProgress {
  let level = 1;
  let left = Math.max(0, Math.floor(total));
  while (level < MAX_LEVEL) {
    const need = xpToAdvance(level);
    if (left < need) {
      return { level, into: left, need, ratio: left / need };
    }
    left -= need;
    level += 1;
  }
  const need = xpToAdvance(MAX_LEVEL);
  return { level: MAX_LEVEL, into: need, need, ratio: 1 };
}

export function totalXp(missions: Mission[]): number {
  return missions.reduce((sum, mission) => sum + (mission.status === "done" ? mission.xp : 0), 0);
}

export function dayKey(ts: number): string {
  const date = new Date(ts);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDayLabel(day: string, now = Date.now()): string {
  const today = dayKey(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = dayKey(yesterdayDate.getTime());
  if (day === today) return "Tonight";
  if (day === yesterday) return "Yesterday";
  const [year, month, date] = day.split("-").map(Number);
  if (!year || !month || !date) return day;
  return new Date(year, month - 1, date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function currentStreak(missions: Mission[], now = Date.now()): number {
  const days = new Set<string>();
  for (const mission of missions) {
    if (mission.status === "done" && mission.completedAt) days.add(dayKey(mission.completedAt));
  }
  // Noon keeps day steps off DST edges.
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!days.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (streak > 2000) break;
  }
  return streak;
}

export function clearedOn(missions: Mission[], now = Date.now()): number {
  const today = dayKey(now);
  return missions.filter(
    (mission) => mission.status === "done" && mission.completedAt && dayKey(mission.completedAt) === today,
  ).length;
}

export function sortMissions(missions: Mission[], status: "ready" | "done"): Mission[] {
  return missions
    .filter((mission) => mission.status === status)
    .sort((a, b) => {
      if (status === "done") return (b.completedAt ?? 0) - (a.completedAt ?? 0);
      if (a.starter !== b.starter) return a.starter ? 1 : -1;
      if (a.starter && b.starter) return a.createdAt - b.createdAt;
      return b.createdAt - a.createdAt;
    });
}

export type DoneGroup = { day: string; label: string; items: Mission[] };

export function groupDone(missions: Mission[], now = Date.now()): DoneGroup[] {
  const groups = new Map<string, Mission[]>();
  for (const mission of sortMissions(missions, "done")) {
    const day = mission.completedAt ? dayKey(mission.completedAt) : "undated";
    const bucket = groups.get(day) ?? [];
    bucket.push(mission);
    groups.set(day, bucket);
  }
  return [...groups.entries()].map(([day, items]) => ({
    day,
    label: day === "undated" ? "Cleared" : formatDayLabel(day, now),
    items,
  }));
}

export function trackStats(missions: Mission[], track: TrackId): { ready: number; done: number; ratio: number } {
  const list = missions.filter((mission) => mission.track === track);
  const done = list.filter((mission) => mission.status === "done").length;
  const ready = list.length - done;
  return { ready, done, ratio: list.length === 0 ? 0 : done / list.length };
}

export type CircuitVisual = "idle" | "ready" | "done";

export function circuitVisual(missions: Mission[], title: string, now = Date.now()): CircuitVisual {
  const related = missions.filter((mission) => mission.track === "fitness" && mission.title === title);
  if (related.some((mission) => mission.status === "ready")) return "ready";
  const today = dayKey(now);
  if (
    related.some(
      (mission) => mission.status === "done" && mission.completedAt && dayKey(mission.completedAt) === today,
    )
  ) {
    return "done";
  }
  return "idle";
}

export function circuitTarget(
  missions: Mission[],
  title: string,
  now = Date.now(),
): { action: "toggle"; id: string } | { action: "queue" } {
  const ready = missions.find(
    (mission) => mission.track === "fitness" && mission.title === title && mission.status === "ready",
  );
  if (ready) return { action: "toggle", id: ready.id };
  const today = dayKey(now);
  const doneToday = missions.find(
    (mission) =>
      mission.track === "fitness" &&
      mission.title === title &&
      mission.status === "done" &&
      mission.completedAt !== null &&
      dayKey(mission.completedAt) === today,
  );
  if (doneToday) return { action: "toggle", id: doneToday.id };
  return { action: "queue" };
}

export function padLevel(level: number): string {
  return level < 10 ? `0${level}` : String(level);
}

export function formatXp(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function clampXp(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return Math.min(500, Math.max(5, Math.round(value)));
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
