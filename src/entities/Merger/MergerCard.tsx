import "./MergerCard.css";
import { useState } from "react";
import type { EntityMergerType } from "../EntitiesTypes";
import Merger from "./MergerTile";
import type { AnchorStyle } from "../Tile";

export default function MergerCard({ entity }: { entity: EntityMergerType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="mergerCard"
      onClick={() => setIsHovering(!isHovering)}
      style={
              {
                anchorName: `${"--anchor-" + entity.id}`,
                gridColumn: entity.x + 1,
                gridRow: entity.y + 1,
              } as AnchorStyle
            }
    >
      {isHovering && <Merger entity={entity} />}
      <div className="mergerMinimized">
        <div style={{gridColumn: "2/2", gridRow: "2/2", placeSelf:"center", fontSize:"200%"}}></div>
        <div style={{gridColumn: "3/3"}}>{entity.val}</div>
      </div>
    </div>
  );
}
