import { type EntityExchangerType } from "../EntitiesTypes";
import "./ExchangerTile.css";
import { DirectionIcons, EntityIcons } from "../Icons";
import { useState } from "react";

export default function Exchanger({ entity }: { entity: EntityExchangerType }) {
  const [lastTimeInputAdded,] = useState(0);


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
      <div className="stored-input-goods">
      {entity.inputGoods.map((good) => {
          const goodKey =  `${good.goodType}-${good.time}`;
          const isNew = lastTimeInputAdded < good.time;

          return (
            <div
              key={goodKey}
              className={`stored-good ${good.goodType} ${isNew ? "new-good" : ""}`}
            />
          );
        })}
      </div>

       <div className="stored-output-goods">
      {entity.outputGoods.map((good) => {
          const goodKey =  `${good.goodType}-${good.time}`;
          const isNew = lastTimeInputAdded < good.time;

          return (
            <div
              key={goodKey}
              className={`stored-good ${good.goodType} ${isNew ? "new-good" : ""}`}
            />
          );
        })}
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
