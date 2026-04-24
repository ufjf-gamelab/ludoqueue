import type { EntityStockType } from "../EntitiesTypes";
import "./StockTile.css";
import StockSprite from "../../assets/stock/StockSprite";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div className="stock-tile">
      {/*{EntityIcons[entity.type]}
      <progress value={entity.goods.length} max={entity.max} />
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
      </div>*/}
      <StockSprite entity={entity} />
    </div>
  );
}
