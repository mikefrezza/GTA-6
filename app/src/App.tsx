import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold } from "@expo-google-fonts/barlow-condensed";
import { Outfit_400Regular, Outfit_600SemiBold } from "@expo-google-fonts/outfit";
import { Composer } from "./components/Composer";
import { IconBoard, IconDone, IconFlame, IconPlus, IconRank, IconTracks } from "./components/Icons";
import { ConfirmDialog, LevelUpOverlay, ToastBar } from "./components/Overlays";
import { circuitTarget, padLevel } from "./game";
import { DoneScreen } from "./screens/DoneScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { RankScreen } from "./screens/RankScreen";
import { TracksScreen } from "./screens/TracksScreen";
import { StoreProvider, useStore } from "./store";
import { colors, fonts } from "./theme";
import type { MissionDraft, Preset, TrackId } from "./types";

type Tab = "home" | "tracks" | "done" | "rank";
type Filter = TrackId | "all";
type ComposerState = { mode: "create"; track: TrackId } | { mode: "edit"; id: string };
type ConfirmState = "reset" | "clear";

const NAV: Array<{ id: Tab; label: string }> = [
  { id: "home", label: "List" },
  { id: "tracks", label: "Tracks" },
  { id: "done", label: "Cleared" },
  { id: "rank", label: "Rank" },
];

function NavIcon({ id, color }: { id: Tab; color: string }) {
  if (id === "home") return <IconBoard color={color} />;
  if (id === "tracks") return <IconTracks color={color} />;
  if (id === "done") return <IconDone color={color} />;
  return <IconRank color={color} />;
}

function NightRep() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("home");
  const [filter, setFilter] = useState<Filter>("all");
  const [composer, setComposer] = useState<ComposerState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [popping, setPopping] = useState<string[]>([]);
  const popRef = useRef(new Set<string>());
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const scrollRef = useRef<ScrollViewInstance>(null);

  useEffect(() => () => timers.current.forEach((id) => clearTimeout(id)), []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [tab, filter]);

  useEffect(() => {
    if (!store.toast || store.levelUp) return;
    const id = setTimeout(() => store.dismissToast(), 4600);
    return () => clearTimeout(id);
  }, [store.toast, store.levelUp, store.dismissToast]);

  function onToggle(id: string) {
    const mission = store.missions.find((item) => item.id === id);
    if (!mission || popRef.current.has(id)) return;
    if (mission.status === "done") {
      store.toggle(id);
      return;
    }
    popRef.current.add(id);
    setPopping([...popRef.current]);
    const timer = setTimeout(() => {
      store.toggle(id);
      popRef.current.delete(id);
      setPopping([...popRef.current]);
    }, 640);
    timers.current.push(timer);
  }

  function onCircuit(preset: Preset) {
    const target = circuitTarget(store.missions, preset.title, Date.now());
    if (target.action === "toggle") {
      onToggle(target.id);
      return;
    }
    store.addMission({ title: preset.title, track: "fitness", xp: preset.xp, note: preset.note });
  }

  function openCreate(track: TrackId = filter === "all" ? "fitness" : filter) {
    setComposer({ mode: "create", track });
  }

  function openEdit(id: string) {
    setComposer({ mode: "edit", id });
  }

  function submitComposer(draft: MissionDraft) {
    if (!composer) return;
    if (composer.mode === "edit") store.updateMission(composer.id, draft);
    else store.addMission(draft);
    setComposer(null);
  }

  if (!store.ready) {
    return (
      <View style={styles.boot}>
        <Text style={styles.bootMark}>NR</Text>
        <Text style={styles.bootName}>Night Rep</Text>
      </View>
    );
  }

  const editing = composer?.mode === "edit" ? store.missions.find((mission) => mission.id === composer.id) : null;
  const composerInitial: MissionDraft = editing
    ? { title: editing.title, track: editing.track, xp: editing.xp, note: editing.note }
    : { title: "", track: composer?.mode === "create" ? composer.track : "fitness", xp: 80, note: "" };

  return (
    <View style={styles.phone}>
      <View style={styles.topbar}>
        <Pressable accessibilityRole="button" onPress={() => setTab("home")} style={styles.wordmark}>
          <View style={styles.mark}>
            <Text style={styles.markText}>NR</Text>
          </View>
          <View>
            <Text style={styles.name}>Night Rep</Text>
            <Text style={styles.sub}>Lv {padLevel(store.level.level)} · {store.readyCount} open</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${store.streak} day streak. Open rank. Level ${padLevel(store.level.level)}.`}
          onPress={() => setTab("rank")}
          style={styles.streak}
        >
          <IconFlame />
          <Text style={styles.streakText}>{store.streak}</Text>
        </Pressable>
      </View>

      {store.toast && !store.levelUp ? <ToastBar toast={store.toast} onUndo={store.undo} /> : null}

      {tab === "home" ? (
        <HomeScreen
          filter={filter}
          popping={popping}
          onFilter={setFilter}
          onToggle={onToggle}
          onEdit={openEdit}
          onDelete={store.deleteMission}
          onCreate={() => openCreate()}
          onCircuit={onCircuit}
          onClearSamples={() => setConfirm("clear")}
        />
      ) : (
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {tab === "tracks" ? (
          <TracksScreen
            onCircuit={onCircuit}
            onOpenTrack={(track) => {
              setFilter(track);
              setTab("home");
            }}
          />
        ) : null}
        {tab === "done" ? (
          <DoneScreen popping={popping} onToggle={onToggle} onEdit={openEdit} onDelete={store.deleteMission} onCreate={() => openCreate()} />
        ) : null}
        {tab === "rank" ? <RankScreen onClearSamples={() => setConfirm("clear")} onReset={() => setConfirm("reset")} /> : null}
      </ScrollView>
      )}

      {tab === "home" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New mission"
          onPress={() => openCreate()}
          style={[styles.fab, { bottom: 72 + insets.bottom }]}
        >
          <IconPlus />
        </Pressable>
      ) : null}

      <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {NAV.map((item) => {
          const active = tab === item.id;
          const color = active ? colors.cyan : colors.dim;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setTab(item.id)}
              style={styles.navBtn}
            >
              <NavIcon id={item.id} color={color} />
              <Text style={[styles.navLabel, { color: active ? colors.ink : colors.dim }]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {composer ? (
        <Composer
          key={composer.mode === "edit" ? composer.id : `new-${composer.track}`}
          initial={composerInitial}
          heading={composer.mode === "edit" ? "Edit mission" : "New mission"}
          submitLabel={composer.mode === "edit" ? "Save mission" : "Queue mission"}
          onClose={() => setComposer(null)}
          onSubmit={submitComposer}
        />
      ) : null}

      {confirm === "clear" ? (
        <ConfirmDialog
          title="Clear sample missions?"
          body="Removes every mission marked Sample. Missions you wrote stay. XP from cleared samples comes off your total."
          confirmLabel="Clear samples"
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            store.clearStarters();
            setConfirm(null);
          }}
        />
      ) : null}

      {confirm === "reset" ? (
        <ConfirmDialog
          title="Reset progress?"
          body="Wipes missions, XP, level, and streak, then loads a fresh sample board."
          confirmLabel="Reset"
          danger
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            store.reset();
            setConfirm(null);
            setTab("home");
            setFilter("all");
          }}
        />
      ) : null}

      {store.levelUp ? <LevelUpOverlay levelUp={store.levelUp} onClose={store.dismissLevelUp} /> : null}
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    BarlowCondensed_800ExtraBold,
    BarlowCondensed_700Bold,
    Outfit_400Regular,
    Outfit_600SemiBold,
  });

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <StatusBar style="light" />
          {fontsLoaded || fontError ? <NightRep /> : <View style={styles.boot} />}
        </SafeAreaView>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  phone: {
    flex: 1,
    backgroundColor: colors.phone,
    borderTopWidth: 1,
    borderTopColor: "rgba(94,242,224,0.35)",
  },
  boot: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  bootMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 64,
    overflow: "hidden",
    color: "#1a0b10",
    backgroundColor: colors.magenta,
    fontFamily: fonts.display,
    fontSize: 28,
  },
  bootName: { marginTop: 12, color: colors.ink, fontFamily: fonts.display, fontSize: 36, letterSpacing: 2 },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  wordmark: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
  mark: { width: 36, height: 36, borderRadius: 11, backgroundColor: colors.magenta, alignItems: "center", justifyContent: "center" },
  markText: { color: "#1a0b10", fontFamily: fonts.display, fontSize: 16 },
  name: { color: colors.ink, fontFamily: fonts.display, fontSize: 22, letterSpacing: 2 },
  sub: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,200,87,0.4)",
    backgroundColor: "rgba(255,200,87,0.1)",
  },
  streakText: { color: colors.gold, fontFamily: fonts.displayMid, fontSize: 22 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  fab: {
    position: "absolute",
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.magenta,
    alignItems: "center",
    justifyContent: "center",
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "rgba(12,9,18,0.96)",
    paddingTop: 6,
  },
  navBtn: { flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center", gap: 2 },
  navLabel: { fontFamily: fonts.bodySemi, fontSize: 11 },
});
