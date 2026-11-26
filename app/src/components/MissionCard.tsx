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
  const xpLabel = mission.status === "done" && !popping ? `${mission.xp} XP` : `+${mission.xp}`;

  return (
    <View style={[styles.card, { borderColor: track.tint }, cleared ? styles.done : null, popping ? styles.pop : null]}>
      <View style={[styles.rail, { backgroundColor: track.tint }]} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: cleared }}
        accessibilityLabel={cleared ? `Reopen ${mission.title}` : `Complete ${mission.title}`}
        onPress={() => onToggle(mission.id)}
        style={styles.check}
      >
        <CheckMark on={cleared} tint={track.tint} />
      </Pressable>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={[styles.title, cleared ? styles.titleDone : null]}>{mission.title}</Text>
          <Text style={[styles.xp, { color: track.tint }]}>{xpLabel}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.meta}>
            <Text style={[styles.track, { color: track.tint }]}>{track.label}</Text>
            {mission.starter ? <Text style={styles.tag}>Sample</Text> : null}
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
        {mission.note ? <Text style={styles.note}>{mission.note}</Text> : null}
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
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 16 },
  titleDone: { textDecorationLine: "line-through", color: colors.muted },
  xp: { fontFamily: fonts.displayMid, fontSize: 18, letterSpacing: 0.4 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
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
  actions: { flexDirection: "row" },
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
