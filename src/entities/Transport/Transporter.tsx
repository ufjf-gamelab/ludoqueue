import type { EntityTransportType } from "../EntitiesTypes";
import "../EntitiesCards.css"
import { FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp } from "react-icons/fa";

export const TransportIcons = {
  down: <FaArrowDown />,
  up: <FaArrowUp />,
  left: <FaArrowLeft />,
  right: <FaArrowRight />
}

export default function Transport({ entity }: { entity: EntityTransportType }) {
  return (
     <div
      key={entity.id}
      className="Card"
    >
      <div className="CardTitle">{entity.id}</div>
      <progress value={entity.val} max={entity.max} style={{ width: "100%" }} />
      <div className="CardSubtitle">
        {entity.val} / {entity.max}
      </div>
      <progress value={entity.cooldown} style={{ width: "100%" }} />
      <div className="CardSubtitle">
        Cooldown: {entity.cooldown} /  Rate: {entity.rate}
      </div>
      <div className="CardSubtitle">
        Direction:  {TransportIcons[entity.direction]}
        {TransportIcons[entity.direction]}
        {TransportIcons[entity.direction]}
      </div>
    </div>
  );
}
