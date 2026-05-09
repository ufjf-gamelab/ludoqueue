import { useState } from "react";
import type { EntityTransportType } from "../EntitiesTypes";
import Transport from "./TransporterTile";
import "./TransportCard.css"
import type { AnchorStyle } from "../Tile";

export default function TransportCard({ entity }: { entity: EntityTransportType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="transportCard"
      onClick={() => setIsHovering(!isHovering)}
      style={
              {
                anchorName: `${"--anchor-" + entity.id}`,
                gridColumn: entity.x + 1,
                gridRow: entity.y + 1,
              } as AnchorStyle
            }
    >
      {isHovering && <Transport entity={entity} />}
      <div className="transportMinimized">
        {/*<div style={{gridColumn: "2/2", gridRow: "2/2", placeSelf:"center", fontSize:"200%"}}>{TransportIcons[entity.direction]}</div>*/}
        <div style={{gridColumn: "3/3"}}>{entity.goods.length}</div>
      </div>
    </div>
  );
}
