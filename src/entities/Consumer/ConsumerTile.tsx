import type { EntityConsumerType } from "../EntitiesTypes";
import "../Toolset.css";
import "./ConsumerTile.css";
import { EntityIcons } from "../Icons";
export default function ConsumerTile({
  entity,
}: {
  entity: EntityConsumerType;
}) {
  return (
    <div className="consumer-tile">
      {EntityIcons[entity.type]}
      <progress value={entity.cooldown} />
    </div>
  );
}
