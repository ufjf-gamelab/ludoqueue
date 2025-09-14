import { useState } from "react";
import type { EntitySourceType } from "../EntitiesTypes";
import Source from "./Source";
import { GiMiner } from "react-icons/gi";
import "./SourceCard.css"

export default function SourceCard({ entity }: { entity: EntitySourceType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className="sourceCard"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <Source entity={entity} />
      ) : (
        <div>
          <GiMiner />
          <progress value={entity.val} max={entity.max}></progress>
        </div>
      )}{" "}
    </button>
  );
}
