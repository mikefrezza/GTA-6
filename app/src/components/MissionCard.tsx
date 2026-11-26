import { Pressable, StyleSheet, Text, View } from "react-native";
import { TRACK_MAP } from "../content";
import { colors, fonts } from "../theme";
import type { Mission } from "../types";
import { CheckMark, IconCheck, IconPencil, IconTrash } from "./Icons";

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
  const status = cleared ? "Cleared" : "Open";

  return (
    <View style={[styles.card, { borderColor: track.tint }, cleared ? styles.done : null, popping ? styles.pop : null]}>
      <View style={[styles.rail, { backgroundColor: track.tint }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: cleared }}
        accessibilityLabel={cleared ? `Reopen ${mission.title}` : `Check off ${mission.title}`}
        onPress={() => onToggle(mission.id)}
        style={styles.check}
      >
        <CheckMark on={cleared} tint={track.tint} />
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.kicker}>Objective</Text>
        <Text style={[styles.title, cleared ? styles.titleDone : null]}>{mission.title}</Text>
        {mission.note ? <Text style={styles.note}>{mission.note}</Text> : null}
        <View style={styles.facts}>
          <View style={styles.fact}>
            <Text style={styles.kicker}>Payout</Text>
            <Text style={[styles.xp, { color: track.tint }]}>{mission.xp} XP</Text>
          </View>
          <View style={styles.fact}>
            <Text style={styles.kicker}>Status</Text>
            <Text style={[styles.status, { color: cleared ? colors.gold : colors.cyan }]}>{status}</Text>
          </View>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${mission.title}`} onPress={() => onEdit(mission.id)} style={styles.iconBtn}>
              <IconPencil />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${mission.title}`} onPress={() => onDelete(mission.id)} style={styles.iconBtn}>
              <IconTrash />
            </Pressable>
          </View>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.track, { color: track.tint }]}>{track.label}</Text>
          {mission.starter ? <Text style={styles.tag}>Sample</Text> : null}
        </View>
        {showReopen && mission.status === "done" ? (
          <Pressable accessibilityRole="button" onPress={() => onToggle(mission.id)} style={styles.reopen}>
            <IconCheck size={14} color={colors.cyan} />
            <Text style={styles.reopenText}>Reopen</Text>
          </Pressable>
        ) : null}
      </View>
      {popping ? <Text style={styles.float}>+{mission.xp} XP</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingLeft: 14,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    overflow: "hidden",
  },
  done: { opacity: 0.82 },
  pop: { transform: [{ scale: 0.98 }] },
  rail: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  check: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, minWidth: 0 },
  kicker: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 16, marginTop: 1 },
  titleDone: { textDecorationLine: "line-through", color: colors.muted },
  facts: { marginTop: 8, flexDirection: "row", alignItems: "flex-end", gap: 14 },
  fact: { minWidth: 72 },
  xp: { fontFamily: fonts.displayMid, fontSize: 18, letterSpacing: 0.4 },
  status: { fontFamily: fonts.displayMid, fontSize: 18, letterSpacing: 0.4 },
  meta: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 8 },
  track: { fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase" },
  tag: {
    color: colors.dim,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: fonts.body,
    fontSize: 11,
    overflow: "hidden",
  },
  actions: { flexDirection: "row", marginLeft: "auto" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  note: { marginTop: 4, color: colors.muted, fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  reopen: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", minHeight: 32 },
  reopenText: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 13 },
  float: {
    position: "absolute",
    right: 16,
    top: 8,
    color: colors.gold,
    fontFamily: fonts.display,
    fontSize: 18,
  },
});
