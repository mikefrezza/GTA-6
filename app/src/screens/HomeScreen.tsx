import { Pressable, StyleSheet, Text, View } from "react-native";
import { FitnessCircuit } from "../components/FitnessCircuit";
import { MissionCard } from "../components/MissionCard";
import { Ring, XpBar } from "../components/Ring";
import { formatXp, padLevel, sortMissions } from "../game";
import { useStore } from "../store";
import { colors, fonts } from "../theme";
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

export function HomeScreen({ popping, onToggle, onEdit, onDelete, onCreate, onOpenBoard, onCircuit, onClearSamples }: Props) {
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
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Current rank</Text>
        <Ring ratio={store.level.ratio} label={`Level ${store.level.level}, ${store.level.into} of ${store.level.need} XP`}>
          <Text style={styles.ringCaption}>Lvl</Text>
          <Text style={styles.ringLevel}>{padLevel(store.level.level)}</Text>
        </Ring>
        <Text style={styles.rank}>{store.rank.name}</Text>
        <Text style={styles.line}>{store.rank.line}</Text>
        <XpBar into={store.level.into} need={store.level.need} ratio={store.level.ratio} />
        <Text style={styles.next}>
          {store.next ? `${store.next.levelsAway} ${store.next.levelsAway === 1 ? "level" : "levels"} to ${store.next.name}` : "Top rank"}
        </Text>
        <View style={styles.stats}>
          <Stat value={String(store.streak)} label="day streak" />
          <Stat value={String(store.clearedToday)} label="cleared today" />
          <Stat value={`${percent}%`} label="complete" />
        </View>
        <Text style={styles.note}>{streakCopy}</Text>
      </View>

      <View style={styles.head}>
        <Text style={styles.headTitle}>Fitness circuit</Text>
        <Text style={styles.meta}>{formatXp(store.xp)} XP total</Text>
      </View>
      <View style={styles.panel}>
        <FitnessCircuit onPress={onCircuit} />
        <Text style={styles.panelNote}>Same missions as the board. Tap a rep to clear it.</Text>
      </View>

      {store.sampleCount > 0 ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            <Text style={styles.bannerStrong}>Sample board. </Text>
            These missions are marked Sample so the first night is not blank. Clear them when the list should be only yours.
          </Text>
          <Pressable accessibilityRole="button" onPress={onClearSamples} style={styles.textBtn}>
            <Text style={styles.textBtnLabel}>Clear samples</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.head}>
        <Text style={styles.headTitle}>Up tonight</Text>
        {store.readyCount > 0 ? (
          <Pressable accessibilityRole="button" onPress={onOpenBoard}>
            <Text style={styles.textBtnLabel}>Full board</Text>
          </Pressable>
        ) : null}
      </View>

      {ready.length > 0 ? (
        <View style={styles.list}>
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
        </View>
      ) : (
        <Empty
          title={store.missions.length === 0 ? "The board is dark" : "Board clear"}
          body={
            store.missions.length === 0
              ? "Queue a mission, clear it, and the rank starts moving."
              : "Every mission is checked. Queue another lap."
          }
          action="New mission"
          onPress={onCreate}
        />
      )}
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function Empty({ title, body, action, onPress }: { title: string; body: string; action: string; onPress: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.line}>{body}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.primary}>
        <Text style={styles.primaryText}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 18, paddingBottom: 28 },
  hero: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(255,77,147,0.45)",
  },
  kicker: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 10 },
  ringCaption: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  ringLevel: { color: colors.ink, fontFamily: fonts.display, fontSize: 42, lineHeight: 44 },
  rank: { marginTop: 8, color: colors.ink, fontFamily: fonts.display, fontSize: 36, textTransform: "uppercase", textAlign: "center" },
  line: { marginTop: 6, color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 20, textAlign: "center" },
  next: { marginTop: 8, color: colors.gold, fontFamily: fonts.bodySemi, fontSize: 13 },
  stats: { marginTop: 14, flexDirection: "row", gap: 8, alignSelf: "stretch" },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: colors.ink, fontFamily: fonts.display, fontSize: 28 },
  statLabel: { color: colors.dim, fontFamily: fonts.body, fontSize: 11, textAlign: "center" },
  note: { marginTop: 10, color: colors.muted, fontFamily: fonts.body, fontSize: 13, textAlign: "center" },
  head: { marginTop: 22, marginBottom: 10, flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  headTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 28, textTransform: "uppercase" },
  meta: { color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
  panel: { borderRadius: 22, padding: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, gap: 10 },
  panelNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  banner: { marginTop: 14, padding: 14, borderRadius: 18, backgroundColor: "rgba(255,200,87,0.08)", borderWidth: 1, borderColor: "rgba(255,200,87,0.28)" },
  bannerText: { color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  bannerStrong: { color: colors.ink, fontFamily: fonts.bodySemi },
  textBtn: { marginTop: 8, alignSelf: "flex-start", minHeight: 36, justifyContent: "center" },
  textBtnLabel: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 14 },
  list: { gap: 10 },
  empty: { alignItems: "flex-start", paddingVertical: 8 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, textTransform: "uppercase" },
  primary: { marginTop: 12, minHeight: 48, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.magenta, alignItems: "center", justifyContent: "center" },
  primaryText: { color: "#1a0b10", fontFamily: fonts.bodySemi, fontSize: 16 },
});
