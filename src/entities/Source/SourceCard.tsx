import { useState } from "react";
import type { EntitySourceType } from "../EntitiesTypes";
import Source from "./SourceTile";
import { EntityIcons } from "../Icons";
import "./SourceCard.css";
import type { AnchorStyle } from "../Tile";


/**
 * 
 * Responsible for rendering a Source entity card (pop-up) with its details and controls
 * 
 */
export default function SourceCard({ entity }: { entity: EntitySourceType }) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      className="source-card"
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

      <div>{entity.id}</div>
      {EntityIcons[entity.type]}
      <div>
        <progress value={entity.val} max={entity.max} />
        {entity.val} / {entity.max}
      </div>

      <div>
        {entity.val} / {entity.max}
      </div>
      <progress value={entity.cooldown} max={1}/>
      <div>
        Cooldown: {entity.cooldown} / Rate: {entity.rate}{" "}
      </div>
    </div>
  );
}
