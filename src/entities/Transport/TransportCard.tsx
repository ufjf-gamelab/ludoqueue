import { useState } from "react";
import type { EntityTransportType } from "../EntitiesTypes";
import Transport from "./Transporter";
import "./TransportCard.css"
import { TransportIcons } from "./Transporter";

export default function TransportCard({ entity }: { entity: EntityTransportType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="transportCard"
      //onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <Transport entity={entity} />
      ) : (
        <div className="transportMinimized">
          <div style={{gridColumn: "2/2", gridRow: "2/2", placeSelf:"center", fontSize:"200%"}}>{TransportIcons[entity.direction]}</div>
          <div style={{gridColumn: "3/3"}}>{entity.val}</div>
        </div>
      )}{" "}
    </div>
  );
}
