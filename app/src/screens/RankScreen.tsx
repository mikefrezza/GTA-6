import { Ring, XpBar } from "../components/Ring";
import { formatXp, getRanks, padLevel } from "../game";
import { useStore } from "../store";

type Props = {
  onClearSamples: () => void;
  onReset: () => void;
};

export function RankScreen({ onClearSamples, onReset }: Props) {
  const store = useStore();
  const ranks = getRanks();

  return (
    <div className="screen">
      <p className="screen-kicker">Your rank</p>
      <section className="hero hero-compact">
        <Ring
          size={112}
          stroke={8}
          ratio={store.level.ratio}
          label={`Level ${store.level.level}, ${store.level.into} of ${store.level.need} XP`}
        >
          <span className="ring-caption">Lvl</span>
          <span className="ring-level ring-level-sm">{padLevel(store.level.level)}</span>
        </Ring>
        <h1 className="rank-name">{store.rank.name}</h1>
        <p className="rank-line">{store.rank.line}</p>
        <XpBar into={store.level.into} need={store.level.need} ratio={store.level.ratio} />
      </section>

      <div className="stat-grid">
        <Stat label="Total XP" value={formatXp(store.xp)} />
        <Stat label="Cleared" value={String(store.doneCount)} />
        <Stat label="Ready" value={String(store.readyCount)} />
        <Stat label="Day streak" value={String(store.streak)} />
        <Stat label="Best streak" value={String(store.bestStreak)} />
        <Stat label="Samples left" value={String(store.sampleCount)} />
      </div>

      <div className="section-head">
        <h2>Ladder</h2>
      </div>
      <ol className="ladder">
        {ranks.map((rank) => {
          const state = store.level.level > rank.max ? "past" : store.level.level >= rank.min ? "current" : "locked";
          const range = rank.min === rank.max ? `Lv ${rank.min}` : `Lv ${rank.min}–${rank.max}`;
          return (
            <li key={rank.name} className={`rank-row is-${state}`}>
              <span className="rank-range">{range}</span>
              <span>
                <strong>{rank.name}</strong>
                <em>{rank.line}</em>
              </span>
              {state === "current" ? <span className="rank-now">Now</span> : <span className="rank-now ghost">{state === "past" ? "Held" : "Locked"}</span>}
            </li>
          );
        })}
      </ol>

      <div className="section-head">
        <h2>Board tools</h2>
      </div>
      <div className="tool-stack">
        <button type="button" className="btn btn-ghost btn-block" onClick={onClearSamples} disabled={store.sampleCount === 0}>
          Clear sample missions
        </button>
        <button type="button" className="btn btn-danger btn-block" onClick={onReset}>
          Reset progress
        </button>
        <p className="tool-note">Reset wipes missions, XP, level, and streak, then reloads the sample board. You can undo it once.</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-tile">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
