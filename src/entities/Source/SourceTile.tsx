import type { EntitySourceType } from "../EntitiesTypes";
import "./SourceTile.css";
import { DirectionIcons, EntityIcons } from "../Icons";

/**
 *
 * Responsible for rendering a Source entity in its game tile form
 *
 */
export default function Source({ entity }: { entity: EntitySourceType }) {
  return (
    <div className="source-tile">
      {EntityIcons[entity.type]}
      <progress
        value={entity.val}
        max={entity.max}
        title={`${entity.val}/${entity.max}`}
      />
      <div className={"movingDirection-" + entity.leavingDirection}>
        {DirectionIcons[entity.leavingDirection]}
      </div>
    </div>
  );
}
