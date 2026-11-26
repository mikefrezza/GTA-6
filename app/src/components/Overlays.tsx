import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { padLevel } from "../game";
import { colors, fonts } from "../theme";
import type { LevelUp, Toast } from "../store";

export function ToastBar({ toast, onUndo }: { toast: Toast; onUndo: () => void }) {
  return (
    <View style={styles.toast} accessibilityRole="text">
      <Text style={styles.toastText}>{toast.text}</Text>
      {toast.canUndo ? (
        <Pressable accessibilityRole="button" onPress={onUndo} style={styles.undo}>
          <Text style={styles.undoText}>Undo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LevelUpOverlay({ levelUp, onClose }: { levelUp: LevelUp; onClose: () => void }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.levelRoot}>
        <View style={styles.levelCard}>
          <Text style={styles.flag}>{levelUp.rankChanged ? "New rank" : "Level up"}</Text>
          <Text style={styles.num}>{padLevel(levelUp.level)}</Text>
          <Text style={styles.rank}>{levelUp.rankName}</Text>
          <Text style={styles.line}>{levelUp.rankLine}</Text>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.primary}>
            <Text style={styles.primaryText}>Keep going</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.confirmRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>{title}</Text>
          <Text style={styles.line}>{body}</Text>
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={onClose} style={[styles.ghost, styles.actionBtn]}>
              <Text style={styles.ghostText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={[danger ? styles.danger : styles.primary, styles.actionBtn]}
            >
              <Text style={danger ? styles.dangerText : styles.primaryText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#1b1524",
    borderWidth: 1,
    borderColor: colors.line,
  },
  toastText: { flex: 1, color: colors.ink, fontFamily: fonts.body, fontSize: 14 },
  undo: { minHeight: 36, justifyContent: "center", paddingHorizontal: 8 },
  undoText: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 14 },
  levelRoot: {
    flex: 1,
    backgroundColor: "rgba(7,6,13,0.86)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  levelCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    padding: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(255,200,87,0.45)",
    alignItems: "center",
  },
  flag: { color: colors.gold, fontFamily: fonts.bodySemi, letterSpacing: 2, textTransform: "uppercase", fontSize: 12 },
  num: { marginTop: 8, color: colors.ink, fontFamily: fonts.display, fontSize: 84, lineHeight: 84 },
  rank: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, textTransform: "uppercase", textAlign: "center" },
  line: { marginTop: 8, color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 21, textAlign: "center" },
  primary: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.magenta,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    alignSelf: "stretch",
  },
  primaryText: { color: "#1a0b10", fontFamily: fonts.bodySemi, fontSize: 16 },
  confirmRoot: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.62)" },
  confirmCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  confirmTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, textTransform: "uppercase" },
  actions: { marginTop: 18, flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, marginTop: 0 },
  ghost: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostText: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 16 },
  danger: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerText: { color: "#1a0b10", fontFamily: fonts.bodySemi, fontSize: 16 },
});
