import type { EntitySourceType } from "../EntitiesTypes";
import "./SourceTile.css";
import { EntitySprites } from "../Assets";

/**
 *
 * Responsible for rendering a Source entity in its game tile form
 *
 */
export default function Source({ entity }: { entity: EntitySourceType }) {
  return (
    <div className="source-tile">
      {EntitySprites(entity)}
      {/* {EntityIcons[entity.type]}
      <progress
        value={entity.val}
        max={entity.max}
        title={`${entity.val}/${entity.max}`}
      /> */}
    </div>
  );
}
