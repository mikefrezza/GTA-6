import { FitnessCircuit } from "../components/FitnessCircuit";
import { MissionCard } from "../components/MissionCard";
import { Ring, XpBar } from "../components/Ring";
import { formatXp, padLevel, sortMissions } from "../game";
import { useStore } from "../store";
import type { Preset } from "../types";

type Props = {
  popping: string[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onOpenBoard: () => void;
  onCircuit: (preset: Preset) => void;
  onClearSamples: () => void;
};

export function HomeScreen({
  popping,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
  onOpenBoard,
  onCircuit,
  onClearSamples,
}: Props) {
  const store = useStore();
  const ready = sortMissions(store.missions, "ready").slice(0, 4);
  const percent = store.missions.length === 0 ? 0 : Math.round((store.doneCount / store.missions.length) * 100);
  const streakCopy =
    store.streak === 0
      ? "Clear one mission and the streak starts."
      : store.clearedToday > 0
        ? "Streak is secured for today."
        : "Streak is live. Clear one tonight to keep it.";

  return (
    <div className="screen">
      <section className="hero">
        <p className="hero-kicker">Current rank</p>
        <Ring
          ratio={store.level.ratio}
          label={`Level ${store.level.level}, ${store.level.into} of ${store.level.need} XP`}
        >
          <span className="ring-caption">Lvl</span>
          <span className="ring-level">{padLevel(store.level.level)}</span>
        </Ring>
        <h1 className="rank-name">{store.rank.name}</h1>
        <p className="rank-line">{store.rank.line}</p>
        <XpBar into={store.level.into} need={store.level.need} ratio={store.level.ratio} />
        <p className="next-rank">
          {store.next
            ? `${store.next.levelsAway} ${store.next.levelsAway === 1 ? "level" : "levels"} to ${store.next.name}`
            : "Top rank"}
        </p>
        <div className="stat-row">
          <div className="stat">
            <b>{store.streak}</b>
            <span>day streak</span>
          </div>
          <div className="stat">
            <b>{store.clearedToday}</b>
            <span>cleared today</span>
          </div>
          <div className="stat">
            <b>{percent}%</b>
            <span>complete</span>
          </div>
        </div>
        <p className="streak-note">{streakCopy}</p>
      </section>

      <div className="section-head">
        <h2>Fitness circuit</h2>
        <span className="section-meta">{formatXp(store.xp)} XP total</span>
      </div>
      <div className="panel">
        <FitnessCircuit onPress={onCircuit} />
        <p className="panel-note">Same missions as the board. Tap a rep to clear it.</p>
      </div>

      {store.sampleCount > 0 ? (
        <div className="sample-banner">
          <p>
            <strong>Sample board.</strong> These missions are marked Sample so the first night is not blank. Clear
            them when the list should be only yours.
          </p>
          <button type="button" className="btn-text" onClick={onClearSamples}>
            Clear samples
          </button>
        </div>
      ) : null}

      <div className="section-head">
        <h2>Up tonight</h2>
        {store.readyCount > 0 ? (
          <button type="button" className="btn-text" onClick={onOpenBoard}>
            Full board
          </button>
        ) : null}
      </div>

      {ready.length > 0 ? (
        <div className="mission-list">
          {ready.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              popping={popping.includes(mission.id)}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2 className="empty-title">{store.missions.length === 0 ? "The board is dark" : "Board clear"}</h2>
          <p>
            {store.missions.length === 0
              ? "Queue a mission, clear it, and the rank starts moving."
              : "Every mission is checked. Queue another lap."}
          </p>
          <button type="button" className="btn btn-primary" onClick={onCreate}>
            New mission
          </button>
        </div>
      )}
    </div>
  );
}
