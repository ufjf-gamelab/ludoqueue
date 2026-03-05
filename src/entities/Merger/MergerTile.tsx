import "./MergerTile.css";
import {
  getInvertedDirection,
  type EntityMergerType,
  type MovingGoodType,
} from "../EntitiesTypes";
import "../Toolset.css";
import { DirectionIcons, EntityIcons } from "../Icons";

export default function MergerTile({ entity }: { entity: EntityMergerType }) {
  const spanKey = String(Math.random());
  let isStarting: boolean = false;
  let isEnding: boolean = false;
  let shouldHaveItem: boolean = false;
  const movingGoods: MovingGoodType[] = entity.movingGoods;
  if (movingGoods.length > 0) {
    shouldHaveItem = true;
  }
  if (entity.val > 0) {
    shouldHaveItem = true;
  }
  const entryDirection = calculateEntryDirection(entity);

  function calculateEntryDirection(entity: EntityMergerType): string {
    switch (entity.nextTargetIndex) {
      case 1: { //ta 1 2 e 0 pq next e o ultimo somado com 1
        if (entity.leavingDirection === "up") {
          return "right";
        } else if (entity.leavingDirection === "down") {
          return "left";
        } else if (entity.leavingDirection === "left") {
          return "up";
        } else if (entity.leavingDirection === "right") {
          return "down";
        }
        return "";
      }
      case 2: {
        if (entity.leavingDirection === "up") {
          return "down";
        } else if (entity.leavingDirection === "down") {
          return "up";
        } else if (entity.leavingDirection === "left") {
          return "right";
        } else if (entity.leavingDirection === "right") {
          return "left";
        }
        return "";
      }
      case 0: {
        if (entity.leavingDirection === "up") {
          return "left";
        } else if (entity.leavingDirection === "down") {
          return "right";
        } else if (entity.leavingDirection === "left") {
          return "down";
        } else if (entity.leavingDirection === "right") {
          return "up";
        }
        return "";
      }
      default: {
        return "";
      }
    }
  }
  return (
    <div className="splitter-tile">
      {EntityIcons.merger}
      <progress
        value={entity.val}
        max={entity.max}
        title={`${entity.val}/${entity.max}`}
      />
      {entity.leavingDirection === "up" && (
        <div>
          <div className="position-up">{DirectionIcons.up}</div>
          <div className="position-down">{DirectionIcons.up}</div>
          <div className="position-right">{DirectionIcons.left}</div>
          <div className="position-left">{DirectionIcons.right}</div>
        </div>
      )}
      {entity.leavingDirection === "down" && (
        <div>
          <div className="position-up">{DirectionIcons.down}</div>
          <div className="position-down">{DirectionIcons.down}</div>
          <div className="position-right">{DirectionIcons.left}</div>
          <div className="position-left">{DirectionIcons.right}</div>
        </div>
      )}
      {entity.leavingDirection === "right" && (
        <div>
          <div className="position-up">{DirectionIcons.down}</div>
          <div className="position-down">{DirectionIcons.up}</div>
          <div className="position-right">{DirectionIcons.right}</div>
          <div className="position-left">{DirectionIcons.right}</div>
        </div>
      )}
      {entity.leavingDirection === "left" && (
        <div>
          <div className="position-up">{DirectionIcons.down}</div>
          <div className="position-down">{DirectionIcons.up}</div>
          <div className="position-right">{DirectionIcons.left}</div>
          <div className="position-left">{DirectionIcons.left}</div>
        </div>
      )}
      {/*movingGoods.map((movingGood) => {
        if (movingGood.target == entity) isStarting = true;
        if (movingGood.source == entity) isEnding = true;
        return (
          <span
            key={spanKey}
            className={[
              "transported-good",
              `${isStarting ? "starting " + getInvertedDirection(entity.entryDirection) : ""}`,
              `${isEnding ? "ending " + leavingDirection : ""}`,
            ].join(" ")}
            style={{ display: shouldHaveItem ? undefined : "none" }}
            aria-hidden="true"
          />
        );
      })*/}
    </div>
  );
}
