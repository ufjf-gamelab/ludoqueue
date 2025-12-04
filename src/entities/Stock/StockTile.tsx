import type { EntityStockType } from "../EntitiesTypes";
import "./StockTile.css";
import { DirectionIcons, EntityIcons, getEntryIcon } from "../Icons";

export default function Stock({ entity }: { entity: EntityStockType }) {  
  return (
    <div className="stock-tile">
      {EntityIcons[entity.type]}
      <progress value={entity.val} max={entity.max} />
      <div className={"movingDirection-" + entity.leavingDirection}>
        {DirectionIcons[entity.leavingDirection]}
      </div>
      <div className={"movingDirection-" + entity.entryDirection}>
        {getEntryIcon(entity.entryDirection)}
      </div>
    </div>
  );
}
