import { useState } from "react";
import type { EntityConsumerType } from "../EntitiesTypes";
import ConsumerTile from "./ConsumerTile";
import "./ConsumerCard.css";
import { EntityIcons } from "../Icons";
import type { AnchorStyle } from "../Tile";

export default function ConsumerCard({
  entity,
}: {
  entity: EntityConsumerType;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="consumerCard"
      onClick={() => setIsHovering(!isHovering)}
      style={
        {
          anchorName: `${"--anchor-" + entity.id}`,
          gridColumn: entity.x + 1,
          gridRow: entity.y + 1,
        } as AnchorStyle
      }
    >
      {isHovering &&
        <ConsumerTile />}
      
        <div className="consumerMinimized">
          <div>
            {EntityIcons[entity.type]}
            <p>Consuming in {entity.cooldown} seconds</p>
          </div>
          <progress value={entity.goods.length} max={entity.max}></progress>
        </div>

    </div>
  );
}
