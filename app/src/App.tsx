import { useEffect, useRef, useState, type ReactNode } from "react";
import { Composer } from "./components/Composer";
import { IconBoard, IconDone, IconFlame, IconHome, IconPlus, IconRank, IconTracks } from "./components/Icons";
import { ConfirmDialog, LevelUpOverlay, ToastBar } from "./components/Overlays";
import { circuitTarget, padLevel } from "./game";
import { DoneScreen } from "./screens/DoneScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MissionsScreen } from "./screens/MissionsScreen";
import { RankScreen } from "./screens/RankScreen";
import { TracksScreen } from "./screens/TracksScreen";
import { useStore } from "./store";
import type { MissionDraft, Preset, TrackId } from "./types";

type Tab = "home" | "board" | "tracks" | "done" | "rank";
type Filter = TrackId | "all";
type ComposerState =
  | { mode: "create"; track: TrackId }
  | { mode: "edit"; id: string };
type ConfirmState = "reset" | "clear";

const NAV: Array<{ id: Tab; label: string; icon: ReactNode }> = [
  { id: "home", label: "Home", icon: <IconHome /> },
  { id: "board", label: "Board", icon: <IconBoard /> },
  { id: "tracks", label: "Tracks", icon: <IconTracks /> },
  { id: "done", label: "Done", icon: <IconDone /> },
  { id: "rank", label: "Rank", icon: <IconRank /> },
];

export function App() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>("home");
  const [filter, setFilter] = useState<Filter>("all");
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [popping, setPopping] = useState<string[]>([]);
  const popRef = useRef(new Set<string>());
  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab, filter]);

  useEffect(() => {
    if (!store.toast || store.levelUp) return;
    const id = window.setTimeout(() => store.dismissToast(), 4600);
    return () => window.clearTimeout(id);
  }, [store.toast, store.levelUp, store.dismissToast]);

  function onToggle(id: string) {
    const mission = store.missions.find((item) => item.id === id);
    if (!mission || popRef.current.has(id)) return;
    if (mission.status === "done") {
      store.toggle(id);
      return;
    }
    popRef.current.add(id);
    setPopping([...popRef.current]);
    const timer = window.setTimeout(() => {
      store.toggle(id);
      popRef.current.delete(id);
      setPopping([...popRef.current]);
    }, 640);
    timers.current.push(timer);
  }

  function onCircuit(preset: Preset) {
    const target = circuitTarget(store.missions, preset.title, Date.now());
    if (target.action === "toggle") {
      onToggle(target.id);
      return;
    }
    store.addMission({ title: preset.title, track: "fitness", xp: preset.xp, note: preset.note });
  }

  function openCreate(track: TrackId = filter === "all" ? "fitness" : filter) {
    setComposer({ mode: "create", track });
  }

  function openEdit(id: string) {
    setComposer({ mode: "edit", id });
  }

  function submitComposer(draft: MissionDraft) {
    if (!composer) return;
    if (composer.mode === "edit") store.updateMission(composer.id, draft);
    else store.addMission(draft);
    setComposer(null);
  }

  const editing = composer?.mode === "edit" ? store.missions.find((mission) => mission.id === composer.id) : null;
  const composerInitial: MissionDraft = editing
    ? { title: editing.title, track: editing.track, xp: editing.xp, note: editing.note }
    : { title: "", track: composer?.mode === "create" ? composer.track : "fitness", xp: 80, note: "" };

  return (
    <div className="stage">
      <aside className="billboard">
        <p className="billboard-kicker">A rank for real life</p>
        <p className="billboard-title">
          Night
          <br />
          Rep
        </p>
        <p className="billboard-lede">
          A mission board for the days you actually live. Clear a rep, bank the XP, and climb a rank that only moves
          when you do.
        </p>
        <dl className="billboard-grid">
          <div>
            <dt>Level</dt>
            <dd>{padLevel(store.level.level)}</dd>
          </div>
          <div>
            <dt>Rank</dt>
            <dd>{store.rank.name}</dd>
          </div>
          <div>
            <dt>Streak</dt>
            <dd>
              {store.streak} {store.streak === 1 ? "day" : "days"}
            </dd>
          </div>
          <div>
            <dt>XP</dt>
            <dd>{store.xp}</dd>
          </div>
        </dl>
      </aside>

      <div className={tab === "board" ? "phone has-fab" : "phone"}>
        <header className="topbar">
          <button type="button" className="wordmark" onClick={() => setTab("home")}>
            <span className="wordmark-mark">NR</span>
            <span>
              <span className="wordmark-name">Night Rep</span>
              <span className="wordmark-sub">Real life, ranked</span>
            </span>
          </button>
          <button
            type="button"
            className="streak-chip"
            onClick={() => setTab("rank")}
            aria-label={`${store.streak} day streak. Open rank.`}
          >
            <IconFlame />
            <span>{store.streak}</span>
          </button>
        </header>

        <main className="phone-scroll" id="main" ref={scrollRef}>
          {store.toast && !store.levelUp ? (
            <div className="toast-wrap">
              <ToastBar toast={store.toast} onUndo={store.undo} />
            </div>
          ) : null}
          {tab === "home" ? (
            <HomeScreen
              popping={popping}
              onToggle={onToggle}
              onEdit={openEdit}
              onDelete={store.deleteMission}
              onCreate={() => openCreate("fitness")}
              onOpenBoard={() => setTab("board")}
              onCircuit={onCircuit}
              onClearSamples={() => setConfirm("clear")}
            />
          ) : null}
          {tab === "board" ? (
            <MissionsScreen
              filter={filter}
              popping={popping}
              onFilter={setFilter}
              onToggle={onToggle}
              onEdit={openEdit}
              onDelete={store.deleteMission}
              onCreate={() => openCreate()}
            />
          ) : null}
          {tab === "tracks" ? (
            <TracksScreen
              onCircuit={onCircuit}
              onOpenTrack={(track) => {
                setFilter(track);
                setTab("board");
              }}
            />
          ) : null}
          {tab === "done" ? (
            <DoneScreen
              popping={popping}
              onToggle={onToggle}
              onEdit={openEdit}
              onDelete={store.deleteMission}
              onCreate={() => openCreate()}
            />
          ) : null}
          {tab === "rank" ? (
            <RankScreen onClearSamples={() => setConfirm("clear")} onReset={() => setConfirm("reset")} />
          ) : null}
        </main>

        {tab === "board" ? (
          <button type="button" className="fab" onClick={() => openCreate()} aria-label="New mission">
            <IconPlus />
          </button>
        ) : null}

        <nav className="nav" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {composer ? (
          <Composer
            key={composer.mode === "edit" ? composer.id : `new-${composer.track}`}
            initial={composerInitial}
            heading={composer.mode === "edit" ? "Edit mission" : "New mission"}
            submitLabel={composer.mode === "edit" ? "Save mission" : "Queue mission"}
            onClose={() => setComposer(null)}
            onSubmit={submitComposer}
          />
        ) : null}

        {confirm === "clear" ? (
          <ConfirmDialog
            title="Clear sample missions?"
            body="Removes every mission marked Sample. Missions you wrote stay. XP from cleared samples comes off your total."
            confirmLabel="Clear samples"
            onClose={() => setConfirm(null)}
            onConfirm={() => {
              store.clearStarters();
              setConfirm(null);
            }}
          />
        ) : null}

        {confirm === "reset" ? (
          <ConfirmDialog
            title="Reset progress?"
            body="Wipes missions, XP, level, and streak, then loads a fresh sample board."
            confirmLabel="Reset"
            danger
            onClose={() => setConfirm(null)}
            onConfirm={() => {
              store.reset();
              setConfirm(null);
              setTab("home");
              setFilter("all");
            }}
          />
        ) : null}

        {store.levelUp ? <LevelUpOverlay levelUp={store.levelUp} onClose={store.dismissLevelUp} /> : null}
      </div>
    </div>
  );
}
