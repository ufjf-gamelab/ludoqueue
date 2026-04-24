import ConsumerSprite from "../../assets/consumer/ConsumerSprite";
import type { EntityConsumerType } from "../EntitiesTypes";
import "../Toolset.css";
import "./ConsumerTile.css";
export default function ConsumerTile({
  entity,
}: {
  entity: EntityConsumerType;
}) {
  return (
    <div className="consumer-tile">
      <ConsumerSprite />
      {/*{EntityIcons[entity.type]}
      <progress value={entity.cooldown} />
      <div className={"movingDirection-" + entity.entryDirection}>
        {getEntryIcon(entity.entryDirection)}
      </div>*/}
    </div>
  );
}
