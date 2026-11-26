import { StyleSheet, Text, View } from "react-native";
import { MissionCard } from "../components/MissionCard";
import { groupDone } from "../game";
import { useStore } from "../store";
import { colors, fonts } from "../theme";
import { Empty } from "./HomeScreen";

type Props = {
  popping: string[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
};

export function DoneScreen({ popping, onToggle, onEdit, onDelete, onCreate }: Props) {
  const store = useStore();
  const groups = groupDone(store.missions, store.now);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>{store.doneCount} banked</Text>
      <Text style={styles.title}>Cleared</Text>
      {groups.length === 0 ? (
        <Empty title="Nothing cleared yet" body="Finish a mission and it lands here, with the day you cleared it." action="New mission" onPress={onCreate} />
      ) : (
        groups.map((group) => (
          <View key={group.day} style={styles.group}>
            <Text style={styles.label}>{group.label}</Text>
            <View style={styles.list}>
              {group.items.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  popping={popping.includes(mission.id)}
                  showReopen
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 18, paddingBottom: 28 },
  kicker: { color: colors.dim, fontFamily: fonts.bodySemi, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase" },
  title: { marginTop: 4, marginBottom: 12, color: colors.ink, fontFamily: fonts.display, fontSize: 44, textTransform: "uppercase" },
  group: { marginBottom: 16 },
  label: { marginBottom: 8, color: colors.gold, fontFamily: fonts.displayMid, fontSize: 18, letterSpacing: 0.6, textTransform: "uppercase" },
  list: { gap: 10 },
});
