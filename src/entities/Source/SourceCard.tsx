import { useState } from "react";
import type { EntitySourceType } from "../EntitiesTypes";
import Source from "./Source";
import { GiMiner } from "react-icons/gi";
import "./SourceCard.css";

export interface AnchorStyle extends React.CSSProperties {
  anchorName?: string;
  positionAnchor?: string;
  positionArea?: string;
  positionTryFallbacks?: string;
}

export default function SourceCard({ entity }: { entity: EntitySourceType }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className="sourceCard"
      onClick={() => setIsHovering(!isHovering)}
      style={
        {
          anchorName: `${"--anchor-" + entity.id}`,
          gridColumn: entity.x + 1,
          gridRow: entity.y + 1,
        } as AnchorStyle
      }
    >
      {isHovering && <Source entity={entity} />}

      <div className="sourceMinimized">
        <GiMiner />
        <progress value={entity.val} max={entity.max}></progress>
        {entity.val} / {entity.max}
      </div>
    </div>
  );
}
