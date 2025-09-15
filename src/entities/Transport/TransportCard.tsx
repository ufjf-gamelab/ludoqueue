import { useState } from "react";
import type { EntityTransportType } from "../EntitiesTypes";
import Transport from "./Transporter";
import { BsMinecartLoaded } from "react-icons/bs";
import "./TransportCard.css"
import { TransportIcons } from "./Transporter";

export default function TransportCard({ entity }: { entity: EntityTransportType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="transportCard"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <Transport entity={entity} />
      ) : (
        <div className="transportMinimized">
          <BsMinecartLoaded />
          <p> {entity.val}  </p>
          <p>{TransportIcons[entity.direction]} {TransportIcons[entity.direction]} {TransportIcons[entity.direction]}</p>
        </div>
      )}{" "}
    </div>
  );
}
