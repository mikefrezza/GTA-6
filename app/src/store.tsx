import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { createStarters, withPartnerStarters } from "./content";
import {
  clearedOn,
  clampXp,
  currentStreak,
  levelFromXp,
  nextRank,
  rankFor,
  totalXp,
  uid,
  type LevelProgress,
} from "./game";
import { loadState, saveState, type Persisted } from "./storage";
import type { Mission, MissionDraft, Rank } from "./types";

export type LevelUp = {
  level: number;
  rankName: string;
  rankLine: string;
  rankChanged: boolean;
};

export type Toast = {
  token: number;
  text: string;
  canUndo: boolean;
};

type Snapshot = { missions: Mission[]; bestStreak: number };

type State = {
  missions: Mission[];
  bestStreak: number;
  undo: Snapshot | null;
  toast: Toast | null;
  levelUp: LevelUp | null;
  toastSeq: number;
};

type Action =
  | { type: "hydrate"; missions: Mission[]; bestStreak: number }
  | { type: "seed-partner" }
  | { type: "toggle"; id: string; now: number }
  | { type: "add"; draft: MissionDraft; now: number }
  | { type: "update"; id: string; draft: MissionDraft }
  | { type: "delete"; id: string }
  | { type: "clear-starters" }
  | { type: "reset" }
  | { type: "undo" }
  | { type: "dismiss-toast" }
  | { type: "dismiss-level" }
  | { type: "toast"; text: string };

function cleanDraft(draft: MissionDraft): MissionDraft | null {
  const title = draft.title.trim().slice(0, 64);
  if (!title) return null;
  return {
    title,
    track: draft.track,
    xp: clampXp(draft.xp),
    note: draft.note.trim().slice(0, 140),
  };
}

function commit(state: State, missions: Mission[], message: string, celebrate: boolean): State {
  const before = levelFromXp(totalXp(state.missions));
  const after = levelFromXp(totalXp(missions));
  const bestStreak = Math.max(state.bestStreak, currentStreak(missions));
  const seq = state.toastSeq + 1;
  const rankBefore = rankFor(before.level);
  const rankAfter = rankFor(after.level);
  let levelUp = state.levelUp;
  if (after.level > before.level && celebrate) {
    levelUp = {
      level: after.level,
      rankName: rankAfter.name,
      rankLine: rankAfter.line,
      rankChanged: rankBefore.name !== rankAfter.name,
    };
  } else if (after.level < before.level) {
    levelUp = null;
  }
  return {
    missions,
    bestStreak,
    undo: { missions: state.missions, bestStreak: state.bestStreak },
    toast: { token: seq, text: message, canUndo: true },
    levelUp,
    toastSeq: seq,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        missions: action.missions,
        bestStreak: Math.max(action.bestStreak, currentStreak(action.missions)),
        undo: null,
        toast: null,
        levelUp: null,
      };
    case "seed-partner":
      return { ...state, missions: withPartnerStarters(state.missions) };
    case "toggle": {
      const mission = state.missions.find((item) => item.id === action.id);
      if (!mission) return state;
      const done = mission.status !== "done";
      const missions = state.missions.map((item) =>
        item.id === action.id
          ? { ...item, status: done ? ("done" as const) : ("ready" as const), completedAt: done ? action.now : null }
          : item,
      );
      const message = done ? `${mission.title} cleared · +${mission.xp} XP` : `${mission.title} reopened · −${mission.xp} XP`;
      return commit(state, missions, message, done);
    }
    case "add": {
      const draft = cleanDraft(action.draft);
      if (!draft) return state;
      const mission: Mission = {
        id: uid(),
        title: draft.title,
        track: draft.track,
        xp: draft.xp,
        note: draft.note,
        status: "ready",
        starter: false,
        createdAt: action.now,
        completedAt: null,
      };
      return commit(state, [mission, ...state.missions], `${draft.title} queued`, false);
    }
    case "update": {
      const mission = state.missions.find((item) => item.id === action.id);
      const draft = cleanDraft(action.draft);
      if (!mission || !draft) return state;
      const missions = state.missions.map((item) =>
        item.id === action.id
          ? {
              ...item,
              title: draft.title,
              track: draft.track,
              xp: draft.xp,
              note: draft.note,
              starter: item.starter && draft.title === item.title,
            }
          : item,
      );
      return commit(state, missions, "Mission saved", mission.status === "done");
    }
    case "delete": {
      const mission = state.missions.find((item) => item.id === action.id);
      if (!mission) return state;
      return commit(
        state,
        state.missions.filter((item) => item.id !== action.id),
        `${mission.title} deleted`,
        false,
      );
    }
    case "clear-starters": {
      if (!state.missions.some((mission) => mission.starter)) return state;
      return commit(
        state,
        state.missions.filter((mission) => !mission.starter),
        "Sample missions cleared",
        false,
      );
    }
    case "reset": {
      const seq = state.toastSeq + 1;
      return {
        missions: createStarters(),
        bestStreak: 0,
        undo: { missions: state.missions, bestStreak: state.bestStreak },
        toast: { token: seq, text: "Progress reset", canUndo: true },
        levelUp: null,
        toastSeq: seq,
      };
    }
    case "undo": {
      if (!state.undo) return { ...state, toast: null };
      const missions = state.undo.missions;
      const before = levelFromXp(totalXp(state.missions));
      const after = levelFromXp(totalXp(missions));
      return {
        missions,
        bestStreak: Math.max(state.undo.bestStreak, currentStreak(missions)),
        undo: null,
        toast: null,
        toastSeq: state.toastSeq + 1,
        levelUp: after.level < before.level ? null : state.levelUp,
      };
    }
    case "dismiss-toast":
      return { ...state, toast: null, undo: null };
    case "dismiss-level":
      return { ...state, levelUp: null };
    case "toast": {
      const seq = state.toastSeq + 1;
      return { ...state, toastSeq: seq, undo: null, toast: { token: seq, text: action.text, canUndo: false } };
    }
    default:
      return state;
  }
}

function boot(): State {
  return { missions: createStarters(), bestStreak: 0, undo: null, toast: null, levelUp: null, toastSeq: 0 };
}

type StoreValue = {
  ready: boolean;
  missions: Mission[];
  bestStreak: number;
  toast: Toast | null;
  levelUp: LevelUp | null;
  now: number;
  xp: number;
  level: LevelProgress;
  rank: Rank;
  next: { name: string; levelsAway: number } | null;
  streak: number;
  clearedToday: number;
  doneCount: number;
  readyCount: number;
  sampleCount: number;
  toggle: (id: string) => void;
  addMission: (draft: MissionDraft) => void;
  updateMission: (id: string, draft: MissionDraft) => void;
  deleteMission: (id: string) => void;
  clearStarters: () => void;
  reset: () => void;
  undo: () => void;
  dismissToast: () => void;
  dismissLevelUp: () => void;
  notify: (text: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, boot);
  const [now, setNow] = useState(() => Date.now());
  const [ready, setReady] = useState(false);
  const warned = useRef(false);
  const canSave = useRef(false);
  const partnerSeeded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadState().then((loaded) => {
      if (cancelled) return;
      if (loaded) {
        const missions = loaded.partnerSeeded ? loaded.missions : withPartnerStarters(loaded.missions);
        partnerSeeded.current = true;
        dispatch({ type: "hydrate", missions, bestStreak: loaded.bestStreak });
      } else {
        partnerSeeded.current = true;
      }
      canSave.current = true;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || partnerSeeded.current) return;
    partnerSeeded.current = true;
    dispatch({ type: "seed-partner" });
  }, [ready]);

  useEffect(() => {
    if (!ready || !canSave.current) return;
    const payload: Persisted = {
      version: 1,
      missions: state.missions,
      bestStreak: state.bestStreak,
      partnerSeeded: partnerSeeded.current,
    };
    saveState(payload).then((ok) => {
      if (!ok && !warned.current) {
        warned.current = true;
        dispatch({ type: "toast", text: "This phone is not storing progress." });
      }
    });
  }, [ready, state.missions, state.bestStreak]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const toggle = useCallback((id: string) => dispatch({ type: "toggle", id, now: Date.now() }), []);
  const addMission = useCallback((draft: MissionDraft) => dispatch({ type: "add", draft, now: Date.now() }), []);
  const updateMission = useCallback((id: string, draft: MissionDraft) => dispatch({ type: "update", id, draft }), []);
  const deleteMission = useCallback((id: string) => dispatch({ type: "delete", id }), []);
  const clearStarters = useCallback(() => dispatch({ type: "clear-starters" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const dismissToast = useCallback(() => dispatch({ type: "dismiss-toast" }), []);
  const dismissLevelUp = useCallback(() => dispatch({ type: "dismiss-level" }), []);
  const notify = useCallback((text: string) => dispatch({ type: "toast", text }), []);

  const xp = totalXp(state.missions);
  const level = levelFromXp(xp);
  const doneCount = state.missions.filter((mission) => mission.status === "done").length;

  const value: StoreValue = {
    ready,
    missions: state.missions,
    bestStreak: state.bestStreak,
    toast: state.toast,
    levelUp: state.levelUp,
    now,
    xp,
    level,
    rank: rankFor(level.level),
    next: nextRank(level.level),
    streak: currentStreak(state.missions, now),
    clearedToday: clearedOn(state.missions, now),
    doneCount,
    readyCount: state.missions.length - doneCount,
    sampleCount: state.missions.filter((mission) => mission.starter).length,
    toggle,
    addMission,
    updateMission,
    deleteMission,
    clearStarters,
    reset,
    undo,
    dismissToast,
    dismissLevelUp,
    notify,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
