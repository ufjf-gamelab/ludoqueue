import type { EntitySourceType } from "../EntitiesTypes";
import { GiMiner } from "react-icons/gi";
import "./SourceTile.css";


/**
 * 
 * Responsible for rendering a Source entity in its game tile form
 * 
 */
export default function Source({ entity }: { entity: EntitySourceType }) {
  return (
    <div className="source-tile">
      <GiMiner />
      <progress
        value={entity.val}
        max={entity.max}
        title={`${entity.val}/${entity.max}`}
      />
    </div>
  );
}
