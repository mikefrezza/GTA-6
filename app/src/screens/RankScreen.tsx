import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ring, XpBar } from "../components/Ring";
import { formatXp, getRanks, padLevel } from "../game";
import { useStore } from "../store";
import { colors, fonts } from "../theme";

type Props = {
  onClearSamples: () => void;
  onReset: () => void;
};

export function RankScreen({ onClearSamples, onReset }: Props) {
  const store = useStore();
  const ranks = getRanks();

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Your rank</Text>
      <View style={styles.hero}>
        <Ring size={112} stroke={8} ratio={store.level.ratio} label={`Level ${store.level.level}, ${store.level.into} of ${store.level.need} XP`}>
          <Text style={styles.caption}>Lvl</Text>
          <Text style={styles.level}>{padLevel(store.level.level)}</Text>
        </Ring>
        <Text style={styles.rank}>{store.rank.name}</Text>
        <Text style={styles.line}>{store.rank.line}</Text>
        <XpBar into={store.level.into} need={store.level.need} ratio={store.level.ratio} />
      </View>

      <View style={styles.grid}>
        <Stat label="Total XP" value={formatXp(store.xp)} />
        <Stat label="Cleared" value={String(store.doneCount)} />
        <Stat label="Ready" value={String(store.readyCount)} />
        <Stat label="Day streak" value={String(store.streak)} />
        <Stat label="Best streak" value={String(store.bestStreak)} />
        <Stat label="Samples left" value={String(store.sampleCount)} />
      </View>

      <Text style={styles.section}>Ladder</Text>
      <View style={styles.ladder}>
        {ranks.map((rank) => {
          const state = store.level.level > rank.max ? "past" : store.level.level >= rank.min ? "current" : "locked";
          const range = rank.min === rank.max ? `Lv ${rank.min}` : `Lv ${rank.min}–${rank.max}`;
          return (
            <View key={rank.name} style={[styles.row, state === "current" ? styles.current : null]}>
              <Text style={styles.range}>{range}</Text>
              <View style={styles.copy}>
                <Text style={styles.name}>{rank.name}</Text>
                <Text style={styles.blurb}>{rank.line}</Text>
              </View>
              <Text style={[styles.now, state === "current" ? styles.nowOn : null]}>
                {state === "current" ? "Now" : state === "past" ? "Held" : "Locked"}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.section}>Board tools</Text>
      <Pressable
        accessibilityRole="button"
        disabled={store.sampleCount === 0}
        onPress={onClearSamples}
        style={[styles.ghost, store.sampleCount === 0 ? styles.disabled : null]}
      >
        <Text style={styles.ghostText}>Clear sample missions</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onReset} style={styles.danger}>
        <Text style={styles.dangerText}>Reset progress</Text>
      </Pressable>
      <Text style={styles.note}>Reset wipes missions, XP, level, and streak, then reloads the sample board. You can undo it once.</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 18, paddingBottom: 28 },
  kicker: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  hero: { marginTop: 10, alignItems: "center", padding: 16, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  caption: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  level: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 36 },
  rank: { marginTop: 8, color: colors.ink, fontFamily: fonts.display, fontSize: 32, textTransform: "uppercase", textAlign: "center" },
  line: { marginTop: 4, color: colors.muted, fontFamily: fonts.body, fontSize: 14, textAlign: "center" },
  grid: { marginTop: 14, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: { width: "31%", flexGrow: 1, padding: 12, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  value: { color: colors.ink, fontFamily: fonts.display, fontSize: 26 },
  tileLabel: { color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
  section: { marginTop: 22, marginBottom: 10, color: colors.ink, fontFamily: fonts.display, fontSize: 28, textTransform: "uppercase" },
  ladder: { gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  current: { borderColor: colors.gold },
  range: { width: 78, color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12 },
  copy: { flex: 1 },
  name: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 15 },
  blurb: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 2 },
  now: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12 },
  nowOn: { color: colors.gold },
  ghost: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.4 },
  ghostText: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 16 },
  danger: { marginTop: 10, minHeight: 48, borderRadius: 14, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center" },
  dangerText: { color: "#1a0b10", fontFamily: fonts.bodySemi, fontSize: 16 },
  note: { marginTop: 10, color: colors.muted, fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
});
