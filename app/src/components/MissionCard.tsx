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
    <View style={[styles.card, cleared ? styles.done : null, popping ? styles.pop : null]}>
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
        <View style={styles.row}>
          <Text style={[styles.title, cleared ? styles.titleDone : null]} numberOfLines={1}>
            {mission.title}
          </Text>
          <Text style={[styles.xp, { color: track.tint }]}>{mission.xp} XP</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.meta} numberOfLines={1}>
            <Text style={{ color: track.tint }}>{track.label}</Text>
            {` · ${status}`}
            {mission.starter ? " · Sample" : ""}
          </Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${mission.title}`} onPress={() => onEdit(mission.id)} style={styles.iconBtn}>
              <IconPencil />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${mission.title}`} onPress={() => onDelete(mission.id)} style={styles.iconBtn}>
              <IconTrash />
            </Pressable>
          </View>
        </View>
        {showReopen && mission.status === "done" ? (
          <Pressable accessibilityRole="button" onPress={() => onToggle(mission.id)} style={styles.reopen}>
            <IconCheck size={14} color={colors.cyan} />
            <Text style={styles.reopenText}>Reopen</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 10,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  done: { opacity: 0.72 },
  pop: { borderColor: colors.gold },
  rail: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  check: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, minWidth: 0 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 16 },
  titleDone: { textDecorationLine: "line-through", color: colors.muted },
  xp: { fontFamily: fonts.displayMid, fontSize: 18, letterSpacing: 0.3 },
  meta: { flex: 1, color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
  actions: { flexDirection: "row" },
  iconBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  reopen: { marginTop: 2, flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", minHeight: 28 },
  reopenText: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 13 },
});
