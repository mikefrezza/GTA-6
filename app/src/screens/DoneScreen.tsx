import { MissionCard } from "../components/MissionCard";
import { groupDone } from "../game";
import { useStore } from "../store";

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
    <div className="screen">
      <p className="screen-kicker">{store.doneCount} banked</p>
      <h1 className="screen-title">Cleared</h1>
      {groups.length === 0 ? (
        <div className="empty">
          <h2 className="empty-title">Nothing cleared yet</h2>
          <p>Finish a mission and it lands here, with the day you cleared it.</p>
          <button type="button" className="btn btn-primary" onClick={onCreate}>
            New mission
          </button>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.day} className="done-group">
            <h2 className="done-label">{group.label}</h2>
            <div className="mission-list">
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
            </div>
          </section>
        ))
      )}
    </div>
  );
}
