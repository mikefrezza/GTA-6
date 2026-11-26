import { Pressable, StyleSheet, Text, View } from "react-native";
import { FitnessCircuit } from "../components/FitnessCircuit";
import { IconChevron, TrackIcon } from "../components/Icons";
import { TRACKS } from "../content";
import { trackStats } from "../game";
import { useStore } from "../store";
import { colors, fonts } from "../theme";
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
    <View style={styles.screen}>
      <Text style={styles.kicker}>Six lanes</Text>
      <Text style={styles.title}>Tracks</Text>
      <Text style={styles.lede}>Fitness sits on the same board as the rest of your life. Clear it, or write your own.</Text>

      <View style={[styles.fitness, { borderColor: fitness.tint }]}>
        <Pressable accessibilityRole="button" onPress={() => onOpenTrack("fitness")} style={styles.row}>
          <View style={[styles.icon, { borderColor: fitness.tint }]}>
            <TrackIcon id="fitness" color={fitness.tint} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.name}>Fitness</Text>
            <Text style={styles.count}>
              {fitnessStats.ready} ready · {fitnessStats.done} cleared
            </Text>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: `${fitnessStats.ratio * 100}%`, backgroundColor: fitness.tint }]} />
            </View>
          </View>
          <IconChevron />
        </Pressable>
        <FitnessCircuit onPress={onCircuit} />
      </View>

      <View style={styles.list}>
        {others.map((track) => {
          const stats = trackStats(missions, track.id);
          return (
            <Pressable key={track.id} accessibilityRole="button" onPress={() => onOpenTrack(track.id)} style={[styles.rowCard, { borderColor: track.tint }]}>
              <View style={[styles.icon, { borderColor: track.tint }]}>
                <TrackIcon id={track.id} color={track.tint} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.name}>{track.label}</Text>
                <Text style={styles.blurb}>{track.blurb}</Text>
                <Text style={styles.count}>
                  {stats.ready} ready · {stats.done} cleared
                </Text>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: `${stats.ratio * 100}%`, backgroundColor: track.tint }]} />
                </View>
              </View>
              <IconChevron />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 18, paddingBottom: 28 },
  kicker: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  title: { marginTop: 4, color: colors.ink, fontFamily: fonts.display, fontSize: 44, textTransform: "uppercase" },
  lede: { marginTop: 8, marginBottom: 16, color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  fitness: { borderRadius: 22, borderWidth: 1, padding: 12, gap: 12, backgroundColor: colors.card },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 20, borderWidth: 1, backgroundColor: colors.card },
  icon: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, minWidth: 0 },
  name: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 16 },
  blurb: { color: colors.muted, fontFamily: fonts.body, fontSize: 13, marginTop: 2 },
  count: { marginTop: 4, color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
  bar: { marginTop: 6, height: 4, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  barFill: { height: "100%" },
  list: { marginTop: 12, gap: 10 },
});
