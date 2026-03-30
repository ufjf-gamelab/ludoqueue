import type { EntityExchangerType } from "../EntitiesTypes";
import "./ExchangerTile.css";
import { DirectionIcons, EntityIcons } from "../Icons";

export default function Exchanger({ entity }: { entity: EntityExchangerType }) {
  return (
    <div className="exchanger-tile">
      {EntityIcons[entity.type]}
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
