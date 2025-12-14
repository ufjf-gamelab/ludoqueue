import type { EntityStockType } from "../EntitiesTypes";
import "./StockTile.css";
import { DirectionIcons, EntityIcons } from "../Icons";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div className="stock-tile">
      {EntityIcons[entity.type]}
      <progress value={entity.val} max={entity.max} />
      <div
        className={
          "entryMovingDirection-" +
          (entity.direction === "up" || entity.direction === "down"
            ? "vertical"
            : "horizontal")
        }
      >
        {DirectionIcons[entity.direction]}
      </div>
      <div
        className={
          "leavingMovingDirection-" +
          (entity.direction === "up" || entity.direction === "down"
            ? "vertical"
            : "horizontal")
        }
      >
        {DirectionIcons[entity.direction]}
      </div>
    </div>
  );
}
