import { useState } from "react";
import type { EntityConsumerType } from "../EntitiesTypes";
import Consumer from "./Consumer";
import { GiTakeMyMoney } from "react-icons/gi";
import "./ConsumerCard.css";

export default function ConsumerCard({
  entity,
}: {
  entity: EntityConsumerType;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className="consumerCard"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <Consumer entity={entity} />
      ) : (
        <div className="consumerMinimized">
          <div>
            <GiTakeMyMoney />
            <p>Consuming in {entity.cooldown} seconds</p>
          </div>
          <progress value={entity.val} max={entity.max}></progress>
        </div>
      )}{" "}
    </button>
  );
}
