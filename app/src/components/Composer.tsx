import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SUGGESTIONS, TRACKS, XP_CHOICES } from "../content";
import { clampXp } from "../game";
import { colors, fonts } from "../theme";
import type { MissionDraft, TrackId } from "../types";
import { TrackIcon } from "./Icons";

type Props = {
  initial: MissionDraft;
  heading: string;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (draft: MissionDraft) => void;
};

export function Composer({ initial, heading, submitLabel, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [track, setTrack] = useState<TrackId>(initial.track);
  const [xp, setXp] = useState(initial.xp);
  const [note, setNote] = useState(initial.note);
  const [error, setError] = useState("");
  const suggestions = SUGGESTIONS[track];

  function submit() {
    if (!title.trim()) {
      setError("Give the objective a short line.");
      return;
    }
    onSubmit({ title, track, xp: clampXp(xp), note });
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.heading}>{heading}</Text>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <Text style={styles.label}>Objective</Text>
            <TextInput
              value={title}
              maxLength={64}
              placeholder="Short objective line"
              placeholderTextColor={colors.dim}
              autoCorrect={false}
              onChangeText={(value) => {
                setTitle(value);
                if (error) setError("");
              }}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.label}>Track</Text>
            <View style={styles.wrap}>
              {TRACKS.map((item) => {
                const selected = track === item.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setTrack(item.id)}
                    style={[styles.pick, { borderColor: selected ? item.tint : colors.line }]}
                  >
                    <TrackIcon id={item.id} size={16} color={selected ? item.tint : colors.muted} />
                    <Text style={[styles.pickText, { color: selected ? item.tint : colors.muted }]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Presets</Text>
            <View style={styles.wrap}>
              {suggestions.map((preset) => {
                const selected = title === preset.title;
                return (
                  <Pressable
                    key={preset.title}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setTitle(preset.title);
                      setNote(preset.note);
                      setXp(preset.xp);
                      setError("");
                    }}
                    style={[styles.chip, selected ? styles.chipOn : null]}
                  >
                    <Text style={[styles.chipText, selected ? styles.chipTextOn : null]}>{preset.title}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Payout</Text>
            <View style={styles.wrap}>
              {XP_CHOICES.map((choice) => {
                const selected = xp === choice;
                return (
                  <Pressable
                    key={choice}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setXp(choice)}
                    style={[styles.chip, selected ? styles.chipOn : null]}
                  >
                    <Text style={[styles.chipText, selected ? styles.chipTextOn : null]}>{choice}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              value={Number.isFinite(xp) ? String(xp) : ""}
              keyboardType="number-pad"
              accessibilityLabel="Custom XP"
              onChangeText={(value) => setXp(Number(value))}
              style={styles.input}
            />

            <Text style={styles.label}>Note</Text>
            <TextInput
              value={note}
              maxLength={140}
              placeholder="Optional. What done looks like."
              placeholderTextColor={colors.dim}
              multiline
              onChangeText={setNote}
              style={[styles.input, styles.note]}
            />

            <Pressable accessibilityRole="button" onPress={submit} style={styles.submit}>
              <Text style={styles.submitText}>{submitLabel}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: {
    maxHeight: "88%",
    backgroundColor: "#120d18",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    paddingBottom: 18,
  },
  handle: { alignSelf: "center", width: 42, height: 4, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.2)", marginTop: 10 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 12 },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, textTransform: "uppercase" },
  close: { minHeight: 40, justifyContent: "center", paddingHorizontal: 8 },
  closeText: { color: colors.cyan, fontFamily: fonts.bodySemi, fontSize: 15 },
  form: { paddingHorizontal: 18, paddingBottom: 24 },
  label: { marginTop: 14, marginBottom: 8, color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  note: { minHeight: 72, textAlignVertical: "top", paddingTop: 12 },
  error: { marginTop: 6, color: colors.danger, fontFamily: fonts.body, fontSize: 13 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pick: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pickText: { fontFamily: fonts.bodySemi, fontSize: 13 },
  chip: { minHeight: 36, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.line, justifyContent: "center" },
  chipOn: { borderColor: colors.cyan, backgroundColor: "rgba(94,242,224,0.1)" },
  chipText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  chipTextOn: { color: colors.cyan },
  submit: {
    marginTop: 18,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: colors.magenta,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#1a0b10", fontFamily: fonts.bodySemi, fontSize: 16 },
});
