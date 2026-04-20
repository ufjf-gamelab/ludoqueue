import type { EntitySourceType } from "../EntitiesTypes";
import "./SourceTile.css";
import { SourceSprite } from "../../assets/source/SourceSprite";

/**
 *
 * Responsible for rendering a Source entity in its game tile form
 *
 */
export default function Source({ entity }: { entity: EntitySourceType }) {
  return (
    <div className="source-tile">
      <SourceSprite entity={entity}/>
      {/*{EntityIcons[entity.type]}
      <progress
        value={entity.goods.length}
        max={entity.max}
        title={`${entity.goods.length}/${entity.max}`}
      />
      <div className={"movingDirection-" + entity.leavingDirection}>
        {DirectionIcons[entity.leavingDirection]}
      </div>*/}
    </div>
  );
}
