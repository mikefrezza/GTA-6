import { MissionCard } from "../components/MissionCard";
import { TRACKS } from "../content";
import { sortMissions } from "../game";
import { useStore } from "../store";
import type { TrackId } from "../types";

type Filter = TrackId | "all";

type Props = {
  filter: Filter;
  popping: string[];
  onFilter: (filter: Filter) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
};

export function MissionsScreen({ filter, popping, onFilter, onToggle, onEdit, onDelete, onCreate }: Props) {
  const { missions } = useStore();
  const ready = sortMissions(missions, "ready").filter((mission) => filter === "all" || mission.track === filter);
  const trackLabel = filter === "all" ? "this board" : TRACKS.find((track) => track.id === filter)?.label ?? "this track";

  return (
    <div className="screen screen-board">
      <p className="screen-kicker">Ready missions</p>
      <h1 className="screen-title">Board</h1>
      <div className="filters" role="toolbar" aria-label="Filter by track">
        <FilterChip
          label="All"
          count={missions.filter((mission) => mission.status === "ready").length}
          pressed={filter === "all"}
          onClick={() => onFilter("all")}
        />
        {TRACKS.map((track) => (
          <FilterChip
            key={track.id}
            label={track.label}
            count={missions.filter((mission) => mission.status === "ready" && mission.track === track.id).length}
            pressed={filter === track.id}
            onClick={() => onFilter(track.id)}
          />
        ))}
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
          <h2 className="empty-title">Nothing ready</h2>
          <p>
            {filter === "all"
              ? "The ready list is empty. Queue a mission or reopen one you already cleared."
              : `Nothing ready on ${trackLabel}. Add one, or enjoy the quiet.`}
          </p>
          <button type="button" className="btn btn-primary" onClick={onCreate}>
            New mission
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  count,
  pressed,
  onClick,
}: {
  label: string;
  count: number;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="chip" aria-pressed={pressed} onClick={onClick}>
      {label}
      <span className="chip-count">{count}</span>
    </button>
  );
}
