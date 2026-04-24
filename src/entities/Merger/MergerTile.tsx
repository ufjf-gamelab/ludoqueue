import "./MergerTile.css";
import {
  type EntityMergerType,
  type MovingGoodType,
} from "../EntitiesTypes";
import "../Toolset.css";
import { findEntity, useGame } from "../../Provider";
import MergerSprite from "../../assets/merger/MergerSprite";

export default function MergerTile({ entity }: { entity: EntityMergerType }) {
  const spanKey = String(Math.random());
  let isStarting: boolean = false;
  let isEnding: boolean = false;
  let shouldHaveItem: boolean = false;
  const { game } = useGame()!;

  const movingGoods: MovingGoodType[] = entity.movingGoods;
  if (movingGoods.length > 0) {
    shouldHaveItem = true;
  }
  if (entity.goods.length > 0) {
    shouldHaveItem = true;
  }
  const entryDirection = calculateEntryDirection(
    movingGoods[0]?.source,
    entity,
  );

  function calculateEntryDirection(
    entityID: string | null,
    merger: EntityMergerType,
  ) {
    if (entityID) {
      const entity = findEntity(entityID, game);
      if (!entity || entity.type === "consumer") return;
      const xOffset = entity.x - merger.x;
      const yOffset = entity.y - merger.y;
      if (xOffset == 0) {
        if (yOffset == 1) {
          return "up";
        }
        if (yOffset == -1) {
          return "down";
        }
      }
      if (yOffset == 0) {
        if (xOffset == 1) {
          return "left";
        }
        if (xOffset == -1) {
          return "right";
        }
      }
    }
  }
  return (
    <div className="splitter-tile">
      {/*{EntityIcons.merger}
      <progress
        value={entity.goods.length}
        max={entity.max}
        title={`${entity.goods.length}/${entity.max}`}
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
      )}*/}
      <MergerSprite entity={entity}/>
      {movingGoods.map((movingGood) => {
        if (movingGood.target == entity.id) isStarting = true;
        if (movingGood.source == entity.id) isEnding = true;
        return (
          <span
            key={spanKey}
            className={[
              "transported-good",
              `${isStarting ? "starting " + entryDirection : ""}`,
              `${isEnding ? "ending " + entity.leavingDirection : ""}`,
              `${entity.movingGoods[0].goodType}`,
            ].join(" ")}
            style={{ display: shouldHaveItem ? undefined : "none" }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
