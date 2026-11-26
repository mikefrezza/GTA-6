import { Pressable, StyleSheet, Text, View } from "react-native";
import { FITNESS_PRESETS } from "../content";
import { circuitVisual } from "../game";
import { colors, fonts } from "../theme";
import type { Preset } from "../types";
import { useStore } from "../store";
import { CircuitGlyph, IconCheck } from "./Icons";

export function FitnessCircuit({ onPress }: { onPress: (preset: Preset) => void }) {
  const { missions, now } = useStore();

  return (
    <View style={styles.row} accessibilityRole="list" accessibilityLabel="Fitness circuit">
      {FITNESS_PRESETS.map((preset) => {
        const visual = circuitVisual(missions, preset.title, now);
        const label =
          visual === "done"
            ? `${preset.title} cleared today. Tap to reopen.`
            : visual === "ready"
              ? `Complete ${preset.title}`
              : `Queue ${preset.title}`;
        const tint = visual === "done" ? colors.gold : visual === "ready" ? colors.cyan : colors.dim;
        return (
          <Pressable
            key={preset.title}
            accessibilityRole="button"
            accessibilityState={{ selected: visual === "done" }}
            accessibilityLabel={label}
            onPress={() => onPress(preset)}
            style={[styles.btn, { borderColor: tint }]}
          >
            <View style={[styles.orb, { backgroundColor: visual === "done" ? "rgba(255,200,87,0.16)" : "rgba(255,255,255,0.04)" }]}>
              {visual === "done" ? <IconCheck size={18} color={colors.gold} /> : <CircuitGlyph name={preset.short} color={tint} />}
            </View>
            <Text style={[styles.label, { color: tint }]}>{preset.short}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  btn: {
    width: "31%",
    minWidth: 92,
    flexGrow: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  orb: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  label: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.4 },
});
