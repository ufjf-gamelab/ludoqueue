import type { EntityConsumerType } from "../EntitiesTypes";
import "../Toolset.css";
import "./ConsumerTile.css";
import { EntityIcons, getEntryIcon } from "../Icons";
export default function ConsumerTile({
  entity,
}: {
  entity: EntityConsumerType;
}) {
  return (
    <div className="consumer-tile">
      {EntityIcons[entity.type]}
      <progress value={entity.cooldown} />
      <div className={"movingDirection-" + entity.entryDirection}>
        {getEntryIcon(entity.entryDirection)}
      </div>
    </div>
  );
}
