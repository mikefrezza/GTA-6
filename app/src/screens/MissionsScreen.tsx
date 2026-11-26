import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MissionCard } from "../components/MissionCard";
import { Empty } from "./HomeScreen";
import { TRACKS } from "../content";
import { sortMissions } from "../game";
import { useStore } from "../store";
import { colors, fonts } from "../theme";
import type { TrackId } from "../types";

type Filter = TrackId | "all";

type Props = {
  filter: Filter;
  popping: string[];
  onFilter: (filter: Filter) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
};

export function MissionsScreen({ filter, popping, onFilter, onToggle, onEdit, onDelete, onCreate }: Props) {
  const { missions } = useStore();
  const ready = sortMissions(missions, "ready").filter((mission) => filter === "all" || mission.track === filter);
  const trackLabel = filter === "all" ? "this board" : TRACKS.find((track) => track.id === filter)?.label ?? "this track";

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Ready missions</Text>
      <Text style={styles.title}>Board</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <FilterChip label="All" count={missions.filter((mission) => mission.status === "ready").length} pressed={filter === "all"} onPress={() => onFilter("all")} />
        {TRACKS.map((track) => (
          <FilterChip
            key={track.id}
            label={track.label}
            count={missions.filter((mission) => mission.status === "ready" && mission.track === track.id).length}
            pressed={filter === track.id}
            onPress={() => onFilter(track.id)}
          />
        ))}
      </ScrollView>
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
          title="Nothing ready"
          body={
            filter === "all"
              ? "The ready list is empty. Queue a mission or reopen one you already cleared."
              : `Nothing ready on ${trackLabel}. Add one, or enjoy the quiet.`
          }
          action="New mission"
          onPress={onCreate}
        />
      )}
    </View>
  );
}

function FilterChip({ label, count, pressed, onPress }: { label: string; count: number; pressed: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: pressed }} onPress={onPress} style={[styles.chip, pressed ? styles.chipOn : null]}>
      <Text style={[styles.chipText, pressed ? styles.chipTextOn : null]}>{label}</Text>
      <Text style={[styles.count, pressed ? styles.chipTextOn : null]}>{count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 18, paddingBottom: 96 },
  kicker: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  title: { marginTop: 4, marginBottom: 12, color: colors.ink, fontFamily: fonts.display, fontSize: 44, textTransform: "uppercase" },
  filters: { gap: 8, paddingBottom: 14 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 36, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.line },
  chipOn: { borderColor: colors.cyan, backgroundColor: "rgba(94,242,224,0.1)" },
  chipText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: 13 },
  chipTextOn: { color: colors.cyan },
  count: { color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
  list: { gap: 10 },
});
