import { FITNESS_PRESETS } from "../content";
import { circuitVisual } from "../game";
import { useStore } from "../store";
import type { Preset } from "../types";
import { CircuitGlyph, IconCheck } from "./Icons";

export function FitnessCircuit({ onPress }: { onPress: (preset: Preset) => void }) {
  const { missions, now } = useStore();

  return (
    <div className="circuit" role="group" aria-label="Fitness circuit">
      {FITNESS_PRESETS.map((preset) => {
        const visual = circuitVisual(missions, preset.title, now);
        const label =
          visual === "done"
            ? `${preset.title} cleared today. Tap to reopen.`
            : visual === "ready"
              ? `Complete ${preset.title}`
              : `Queue ${preset.title}`;
        return (
          <button
            key={preset.title}
            type="button"
            className={`circuit-btn is-${visual}`}
            aria-pressed={visual === "done"}
            aria-label={label}
            onClick={() => onPress(preset)}
          >
            <span className="circuit-orb">{visual === "done" ? <IconCheck size={18} /> : <CircuitGlyph name={preset.short} />}</span>
            <span>{preset.short}</span>
          </button>
        );
      })}
    </div>
  );
}
