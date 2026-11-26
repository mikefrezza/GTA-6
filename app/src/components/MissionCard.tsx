import type { CSSProperties } from "react";
import { TRACK_MAP } from "../content";
import type { Mission } from "../types";
import { IconCheck, IconPencil, IconTrash } from "./Icons";

type Props = {
  mission: Mission;
  popping: boolean;
  showReopen?: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function MissionCard({ mission, popping, showReopen = false, onToggle, onEdit, onDelete }: Props) {
  const track = TRACK_MAP[mission.track];
  const cleared = mission.status === "done" || popping;
  const xpLabel = mission.status === "done" && !popping ? `${mission.xp} XP` : `+${mission.xp}`;

  return (
    <article
      className={popping ? "mission is-pop" : mission.status === "done" ? "mission is-done" : "mission"}
      data-track={mission.track}
      style={{ "--tint": track.tint } as CSSProperties}
    >
      <button
        type="button"
        className="check"
        aria-pressed={cleared}
        aria-label={cleared ? `Reopen ${mission.title}` : `Complete ${mission.title}`}
        onClick={() => onToggle(mission.id)}
      >
        <svg className={cleared ? "check-svg on" : "check-svg"} viewBox="0 0 32 32" aria-hidden="true">
          <circle className="check-ring" cx="16" cy="16" r="12" />
          <path className="check-mark" d="M9.5 16.5 14 21l8.5-9.5" />
        </svg>
      </button>
      <div className="mission-body">
        <div className="mission-row">
          <h3 className="mission-title">{mission.title}</h3>
          <span className="xp-pill">{xpLabel}</span>
        </div>
        <div className="mission-row mission-sub">
          <p className="mission-meta">
            <span className="track-name">{track.label}</span>
            {mission.starter ? <span className="tag">Sample</span> : null}
          </p>
          <div className="mission-actions">
            <button type="button" className="icon-btn" aria-label={`Edit ${mission.title}`} onClick={() => onEdit(mission.id)}>
              <IconPencil />
            </button>
            <button type="button" className="icon-btn" aria-label={`Delete ${mission.title}`} onClick={() => onDelete(mission.id)}>
              <IconTrash />
            </button>
          </div>
        </div>
        {mission.note ? <p className="mission-note">{mission.note}</p> : null}
        {showReopen && mission.status === "done" ? (
          <button type="button" className="btn-text" onClick={() => onToggle(mission.id)}>
            <IconCheck size={14} /> Reopen
          </button>
        ) : null}
      </div>
      {popping ? <span className="xp-float">+{mission.xp} XP</span> : null}
    </article>
  );
}
