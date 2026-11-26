import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FitnessCircuit } from "../components/FitnessCircuit";
import { MissionCard } from "../components/MissionCard";
import { TRACKS } from "../content";
import { sortMissions } from "../game";
import { useStore } from "../store";
import { colors, fonts } from "../theme";
import type { Preset, TrackId } from "../types";

type Filter = TrackId | "all";

type Props = {
  filter: Filter;
  popping: string[];
  onFilter: (filter: Filter) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onCircuit: (preset: Preset) => void;
  onClearSamples: () => void;
};

export function HomeScreen({
  filter,
  popping,
  onFilter,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
  onCircuit,
  onClearSamples,
}: Props) {
  const store = useStore();
  const scoped = store.missions.filter((mission) => filter === "all" || mission.track === filter);
  const open = sortMissions(scoped, "ready");
  const cleared = scoped.filter((mission) => mission.status === "done").length;
  const payoutLeft = open.reduce((sum, mission) => sum + mission.xp, 0);
  const ratio = scoped.length === 0 ? 0 : cleared / scoped.length;
  const track = filter === "all" ? null : TRACKS.find((item) => item.id === filter) ?? null;
  const tint = track?.tint ?? colors.cyan;
  const title = track?.label ?? "All objectives";

  return (
    <View style={styles.screen}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        <TabChip label="All" count={store.readyCount} pressed={filter === "all"} tint={colors.cyan} onPress={() => onFilter("all")} />
        {TRACKS.map((item) => (
          <TabChip
            key={item.id}
            label={item.label}
            count={store.missions.filter((mission) => mission.status === "ready" && mission.track === item.id).length}
            pressed={filter === item.id}
            tint={item.tint}
            onPress={() => onFilter(item.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.progress}>
        <View style={styles.progressHead}>
          <Text style={styles.progressTitle}>{title}</Text>
          <Text style={[styles.progressMeta, { color: tint }]}>{Math.round(ratio * 100)}%</Text>
        </View>
        <View style={styles.bar} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}>
          <View style={[styles.barFill, { width: `${Math.round(ratio * 100)}%`, backgroundColor: tint }]} />
        </View>
        <Text style={styles.progressNote}>
          {open.length} open · {cleared} cleared · {payoutLeft} XP still on the board
        </Text>
      </View>

      <ScrollView style={styles.listScroll} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {store.sampleCount > 0 && filter === "all" ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Sample objectives are on the board so the first night is not empty.</Text>
            <Pressable accessibilityRole="button" onPress={onClearSamples}>
              <Text style={styles.bannerAction}>Clear samples</Text>
            </Pressable>
          </View>
        ) : null}

        {filter === "fitness" ? (
          <View style={styles.circuit}>
            <Text style={styles.circuitLabel}>Fitness circuit</Text>
            <FitnessCircuit onPress={onCircuit} />
          </View>
        ) : null}

        {open.length > 0 ? (
          open.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              popping={popping.includes(mission.id)}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <Empty
            title={scoped.length === 0 ? "No objectives" : "Board clear"}
            body={
              scoped.length === 0
                ? `Nothing queued on ${title}. Add one, with a payout, and check it off when it is done.`
                : "Every objective here is checked. Queue another."
            }
            action="New objective"
            onPress={onCreate}
          />
        )}
      </ScrollView>
    </View>
  );
}

function TabChip({
  label,
  count,
  pressed,
  tint,
  onPress,
}: {
  label: string;
  count: number;
  pressed: boolean;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: pressed }}
      onPress={onPress}
      style={[styles.tab, pressed ? { borderColor: tint, backgroundColor: "rgba(255,255,255,0.04)" } : null]}
    >
      <Text style={[styles.tabText, pressed ? { color: tint } : null]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.tabCount, pressed ? { color: tint } : null]}>{count}</Text>
    </Pressable>
  );
}

export function Empty({ title, body, action, onPress }: { title: string; body: string; action: string; onPress: () => void }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.primary}>
        <Text style={styles.primaryText}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  tabs: { gap: 8, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    maxWidth: 210,
  },
  tabText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: 13 },
  tabCount: { color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
  progress: { paddingHorizontal: 16, paddingBottom: 8 },
  progressHead: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  progressTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 28, textTransform: "uppercase" },
  progressMeta: { fontFamily: fonts.displayMid, fontSize: 22 },
  bar: { marginTop: 8, height: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  barFill: { height: "100%" },
  progressNote: { marginTop: 6, color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  listScroll: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 96, gap: 8 },
  banner: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,200,87,0.28)",
    backgroundColor: "rgba(255,200,87,0.08)",
    gap: 6,
  },
  bannerText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  bannerAction: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 13 },
  circuit: { padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, gap: 8 },
  circuitLabel: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  empty: { paddingVertical: 12 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, textTransform: "uppercase" },
  emptyBody: { marginTop: 6, color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  primary: {
    marginTop: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.magenta,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  primaryText: { color: "#1a0b10", fontFamily: fonts.bodySemi, fontSize: 16 },
});
