import type { CSSProperties } from "react";
import { FitnessCircuit } from "../components/FitnessCircuit";
import { IconChevron, TrackIcon } from "../components/Icons";
import { TRACKS } from "../content";
import { trackStats } from "../game";
import { useStore } from "../store";
import type { Preset, TrackId } from "../types";

type Props = {
  onOpenTrack: (track: TrackId) => void;
  onCircuit: (preset: Preset) => void;
};

export function TracksScreen({ onOpenTrack, onCircuit }: Props) {
  const { missions } = useStore();
  const fitness = TRACKS[0];
  const fitnessStats = trackStats(missions, "fitness");
  const others = TRACKS.slice(1);

  return (
    <div className="screen">
      <p className="screen-kicker">Six lanes</p>
      <h1 className="screen-title">Tracks</h1>
      <p className="lede">Fitness sits on the same board as the rest of your life. Clear it, or write your own.</p>

      <section className="fitness-card" style={{ "--tint": fitness.tint } as CSSProperties}>
        <button type="button" className="fitness-head" onClick={() => onOpenTrack("fitness")}>
          <span className="track-icon">
            <TrackIcon id="fitness" />
          </span>
          <span className="track-copy">
            <strong>Fitness</strong>
            <span>
              {fitnessStats.ready} ready · {fitnessStats.done} cleared
            </span>
            <span className="mini-bar" aria-hidden="true">
              <span style={{ width: `${fitnessStats.ratio * 100}%` }} />
            </span>
          </span>
          <IconChevron />
        </button>
        <FitnessCircuit onPress={onCircuit} />
      </section>

      <div className="track-list">
        {others.map((track) => {
          const stats = trackStats(missions, track.id);
          return (
            <button
              key={track.id}
              type="button"
              className="track-row"
              style={{ "--tint": track.tint } as CSSProperties}
              onClick={() => onOpenTrack(track.id)}
            >
              <span className="track-icon">
                <TrackIcon id={track.id} />
              </span>
              <span className="track-copy">
                <strong>{track.label}</strong>
                <em>{track.blurb}</em>
                <span className="track-count">
                  {stats.ready} ready · {stats.done} cleared
                </span>
                <span className="mini-bar" aria-hidden="true">
                  <span style={{ width: `${stats.ratio * 100}%` }} />
                </span>
              </span>
              <IconChevron />
            </button>
          );
        })}
      </div>
    </div>
  );
}
