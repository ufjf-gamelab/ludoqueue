import { useState } from "react";
import type { EntityConsumerType } from "../EntitiesTypes";
import Consumer from "./Consumer";
import { GiTakeMyMoney } from "react-icons/gi";
import "./ConsumerCard.css";
import type { AnchorStyle } from "../Source/SourceCard";

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
        <Consumer entity={entity} />}
      
        <div className="consumerMinimized">
          <div>
            <GiTakeMyMoney />
            <p>Consuming in {entity.cooldown} seconds</p>
          </div>
          <progress value={entity.val} max={entity.max}></progress>
        </div>

    </div>
  );
}
