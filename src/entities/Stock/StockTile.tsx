import type { EntityStockType } from "../EntitiesTypes";
import "./StockTile.css";
import { EntityIcons } from "../Icons";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div className="stock-tile">
      {EntityIcons[entity.type]}
      <progress value={entity.val} max={entity.max} />
    </div>
  );
}
