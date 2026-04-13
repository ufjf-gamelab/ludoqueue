import { type EntityExchangerType } from "../EntitiesTypes";
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
      {/*{entity.movingGoods.length > 0 && (
        <div
          className={[
            "box-of-goods",
            `${"starting " + getInvertedDirection(entity.direction)}`,
          ].join(" ")}
        >
          {entity.recipe.input.map(([goodType, amount]) =>
            Array.from({ length: amount }).map((_, index) => (
              <span
                key={`${goodType}-${index}`}
                className={[
                  "transported-good",
                  goodType,
                  "starting",
                  getInvertedDirection(entity.direction),
                ].join(" ")}
              ></span>
            )),
          )}
        </div>
      )}*/}
      {entity.movingGoods.length > 0 && (
        <div
          className={["box-of-goods", `${"ending " + entity.direction}`].join(
            " ",
          )}
        >
          {entity.recipe.output.map(([goodType, amount]) =>
            Array.from({ length: amount }).map((_, index) => (
              <span
                key={`${goodType}-${index}`}
                className={[
                  "transported-good",
                  goodType,
                  "ending",
                  entity.direction,
                ].join(" ")}
              ></span>
            )),
          )}
        </div>
      )}
    </div>
  );
}
