import type { Mission, Preset, TrackId, TrackMeta } from "./types";

export const TRACKS: TrackMeta[] = [
  { id: "fitness", label: "Fitness", blurb: "Run, lift, swim, stretch, steps, sleep.", tint: "#5ef2e0" },
  { id: "partner", label: "Significant Other", blurb: "Flowers, a date, dinner, a check-in, a small surprise.", tint: "#ff5cdb" },
  { id: "health", label: "Health", blurb: "Food, water, and the unglamorous basics.", tint: "#ff5fa2" },
  { id: "work", label: "Work", blurb: "Deep blocks and closed loops.", tint: "#ffc857" },
  { id: "money", label: "Money", blurb: "Spend logged. Cash pointed on purpose.", tint: "#ffb15a" },
  { id: "social", label: "Social", blurb: "People you meant to show up for.", tint: "#c9a6ff" },
  { id: "skills", label: "Skills", blurb: "Practice you can feel stacking up.", tint: "#7eb6ff" },
];

export const TRACK_MAP: Record<TrackId, TrackMeta> = {
  fitness: TRACKS[0],
  partner: TRACKS[1],
  health: TRACKS[2],
  work: TRACKS[3],
  money: TRACKS[4],
  social: TRACKS[5],
  skills: TRACKS[6],
};

export const FITNESS_PRESETS: Preset[] = [
  { title: "Morning run", short: "Run", note: "Easy pace, 20–30 minutes", xp: 60 },
  { title: "Lift session", short: "Lift", note: "Push, pull, or legs", xp: 80 },
  { title: "Swim laps", short: "Swim", note: "Twenty minutes in the water", xp: 70 },
  { title: "Mobility stretch", short: "Stretch", note: "Ten slow minutes", xp: 30 },
  { title: "Step target", short: "Steps", note: "Hit 8,000 steps", xp: 40 },
  { title: "Sleep window", short: "Sleep", note: "Lights out on time", xp: 50 },
];

export const SUGGESTIONS: Record<TrackId, Preset[]> = {
  fitness: FITNESS_PRESETS,
  partner: [
    { title: "Get flowers", short: "Flowers", note: "A bunch they would actually like.", xp: 40 },
    { title: "Plan a date", short: "Date", note: "Pick a time and a place.", xp: 50 },
    { title: "Cook dinner", short: "Dinner", note: "A meal at home, for both of you.", xp: 60 },
    { title: "Send a check-in", short: "Check-in", note: "A real note in the middle of the day.", xp: 25 },
    { title: "A small surprise", short: "Surprise", note: "Something small they did not ask for.", xp: 45 },
  ],
  health: [
    { title: "Water block", short: "Water", note: "Eight glasses, spaced through the day", xp: 25 },
    { title: "Cook one real meal", short: "Cook", note: "Something you can name the ingredients for", xp: 40 },
    { title: "Lunch outside", short: "Air", note: "Ten minutes of daylight off a screen", xp: 20 },
  ],
  work: [
    { title: "Deep work block", short: "Deep", note: "Ninety minutes, one target", xp: 75 },
    { title: "Close an open loop", short: "Loop", note: "The reply or errand you keep dodging", xp: 35 },
    { title: "Plan tomorrow", short: "Plan", note: "Five lines. Then stop.", xp: 25 },
  ],
  money: [
    { title: "Log today's spend", short: "Log", note: "Every purchase, no editing the story", xp: 25 },
    { title: "Move spare cash", short: "Save", note: "Send a slice to savings", xp: 50 },
    { title: "Check the week ahead", short: "Week", note: "Bills and paydays, one look", xp: 30 },
  ],
  social: [
    { title: "Message someone you miss", short: "Note", note: "A real note, not a reaction", xp: 35 },
    { title: "Put a plan on the calendar", short: "Plan", note: "One hang with a time attached", xp: 40 },
    { title: "Eat with someone", short: "Table", note: "A meal that is not at your desk", xp: 45 },
  ],
  skills: [
    { title: "Practice block", short: "Rep", note: "Twenty-five minutes on the skill you claim", xp: 55 },
    { title: "Read ten pages", short: "Read", note: "Paper or screen. Finish the section.", xp: 30 },
    { title: "Write what you learned", short: "Note", note: "Five lines while it is still fresh", xp: 35 },
  ],
};

const STARTER_PICKS: Array<{ track: TrackId; title: string }> = [
  { track: "fitness", title: "Morning run" },
  { track: "fitness", title: "Lift session" },
  { track: "fitness", title: "Swim laps" },
  { track: "fitness", title: "Mobility stretch" },
  { track: "fitness", title: "Step target" },
  { track: "fitness", title: "Sleep window" },
  { track: "health", title: "Water block" },
  { track: "health", title: "Cook one real meal" },
  { track: "work", title: "Deep work block" },
  { track: "work", title: "Close an open loop" },
  { track: "money", title: "Log today's spend" },
  { track: "social", title: "Message someone you miss" },
  { track: "partner", title: "Get flowers" },
  { track: "partner", title: "Plan a date" },
  { track: "partner", title: "Cook dinner" },
  { track: "partner", title: "Send a check-in" },
  { track: "partner", title: "A small surprise" },
  { track: "skills", title: "Practice block" },
];

function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createStarters(): Mission[] {
  return STARTER_PICKS.map((pick, index) => {
    const preset = SUGGESTIONS[pick.track].find((item) => item.title === pick.title);
    if (!preset) throw new Error(`Missing preset ${pick.title}`);
    return {
      id: `starter-${slug(preset.title)}`,
      title: preset.title,
      track: pick.track,
      xp: preset.xp,
      note: preset.note,
      status: "ready" as const,
      starter: true,
      createdAt: index + 1,
      completedAt: null,
    };
  });
}

export function withPartnerStarters(missions: Mission[]): Mission[] {
  if (missions.some((mission) => mission.track === "partner")) return missions;
  const extras = createStarters().filter((mission) => mission.track === "partner");
  return [...missions, ...extras];
}

export const XP_CHOICES = [30, 50, 80, 120, 200];
