import type { EntityConsumerType } from "../EntitiesTypes";
import "../Toolset.css";
import "./ConsumerTile.css";
import { EntitySprites } from "../Assets";
export default function ConsumerTile({
  entity,
}: {
  entity: EntityConsumerType;
}) {
  return (
    <div className="consumer-tile">
      {/* {EntityIcons[entity.type]}
      <progress value={entity.cooldown} /> */}
      {EntitySprites(entity)}
    </div>
  );
}
