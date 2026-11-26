import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { SUGGESTIONS, TRACKS, XP_CHOICES } from "../content";
import { clampXp } from "../game";
import type { MissionDraft, TrackId } from "../types";
import { TrackIcon } from "./Icons";

type Props = {
  initial: MissionDraft;
  heading: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (draft: MissionDraft) => void;
};

export function Composer({ initial, heading, submitLabel, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [track, setTrack] = useState<TrackId>(initial.track);
  const [xp, setXp] = useState(initial.xp);
  const [note, setNote] = useState(initial.note);
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give the mission a name.");
      titleRef.current?.focus();
      return;
    }
    onSubmit({ title, track, xp: clampXp(xp), note });
  }

  const suggestions = SUGGESTIONS[track];

  return (
    <div className="sheet-root" role="dialog" aria-modal="true" aria-labelledby="composer-title">
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" ref={panelRef}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <h2 id="composer-title">{heading}</h2>
          <button type="button" className="btn-text" onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={submit}>
          <label className="field">
            <span>Mission</span>
            <input
              ref={titleRef}
              value={title}
              maxLength={64}
              placeholder="Name the mission"
              autoComplete="off"
              enterKeyHint="done"
              aria-invalid={error ? true : undefined}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) setError("");
              }}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="field">
            <span id="track-label">Track</span>
            <div className="track-picks" role="radiogroup" aria-labelledby="track-label">
              {TRACKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={track === item.id}
                  style={{ "--tint": item.tint } as CSSProperties}
                  onClick={() => setTrack(item.id)}
                >
                  <TrackIcon id={item.id} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span>Presets</span>
            <div className="preset-row">
              {suggestions.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  className="chip"
                  aria-pressed={title === preset.title}
                  onClick={() => {
                    setTitle(preset.title);
                    setNote(preset.note);
                    setXp(preset.xp);
                    setError("");
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
          <label className="field">
            <span>XP reward</span>
            <div className="xp-choices">
              {XP_CHOICES.map((choice) => (
                <button key={choice} type="button" aria-pressed={xp === choice} onClick={() => setXp(choice)}>
                  {choice}
                </button>
              ))}
            </div>
            <input
              className="xp-input"
              type="number"
              min={5}
              max={500}
              inputMode="numeric"
              aria-label="Custom XP"
              value={Number.isFinite(xp) ? xp : ""}
              onChange={(event) => setXp(event.target.valueAsNumber)}
            />
          </label>
          <label className="field">
            <span>Note</span>
            <textarea
              value={note}
              maxLength={140}
              rows={2}
              placeholder="Optional. What done looks like."
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
