import "./SplitterCard.css";
import { useState } from "react";
import type { EntitySplitterType } from "../EntitiesTypes";
import Splitter from "./SplitterTile";
import type { AnchorStyle } from "../Tile";

export default function SplitterCard({ entity }: { entity: EntitySplitterType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="splitterCard"
      onClick={() => setIsHovering(!isHovering)}
      style={
              {
                anchorName: `${"--anchor-" + entity.id}`,
                gridColumn: entity.x + 1,
                gridRow: entity.y + 1,
              } as AnchorStyle
            }
    >
      {isHovering && <Splitter entity={entity} />}
      <div className="splitterMinimized">
        <div style={{gridColumn: "2/2", gridRow: "2/2", placeSelf:"center", fontSize:"200%"}}></div>
        <div style={{gridColumn: "3/3"}}>{entity.val}</div>
      </div>
    </div>
  );
}
