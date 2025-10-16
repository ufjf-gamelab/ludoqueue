import type { EntityStockType } from "../EntitiesTypes";
import "./StockTile.css";
import { EntitySprites } from "../Assets";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div className="stock-tile">
      {/* {EntityIcons[entity.type]}
      <progress value={entity.val} max={entity.max} /> */}
      {EntitySprites(entity)}
    </div>
  );
}
