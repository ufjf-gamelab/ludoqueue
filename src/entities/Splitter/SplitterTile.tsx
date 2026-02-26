import "./SplitterTile.css";
import { getInvertedDirection, type EntitySplitterType, type MovingGoodType } from "../EntitiesTypes";
import "../Toolset.css";

export default function SplitterTile({ entity }: { entity: EntitySplitterType }) {
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
  const leavingDirection = calculateLeavingDirection(entity);

  function calculateLeavingDirection(entity: EntitySplitterType): string {
    switch (entity.lastTargetIndex){
        case 0:{
            if (entity.entryDirection === "up"){
                return "right";
            }
            else if (entity.entryDirection === "down"){
                return "left";
            }
            else if (entity.entryDirection === "left"){
                return "up";
            }
            else if (entity.entryDirection === "right"){
                return "down";
            }
            return "";}
        case 1:{
            if (entity.entryDirection === "up"){
                return "down";
            }
            else if (entity.entryDirection === "down"){
                return "up";
            }
            else if (entity.entryDirection === "left"){
                return "right";
            }
            else if (entity.entryDirection === "right"){
                return "left";
            }
            return "";
        }
        case 2:{
            if (entity.entryDirection === "up"){
                return "left";
            }
            else if (entity.entryDirection === "down"){
                return "right";
            }
            else if (entity.entryDirection === "left"){
                return "down";
            }
            else if (entity.entryDirection === "right"){
                return "up";
            }
            return "";
        }
        default:{
            return "";
        }
    }
  }
  return (
    <div className="transporter-tile">
      <progress value={entity.val} max={entity.max} title={`${entity.val}/${entity.max}`} />
      {movingGoods.map((movingGood) => {
        if (movingGood.target == entity)
          isStarting = true;
        if (movingGood.source == entity)
          isEnding = true;
        return (<span
          key={spanKey}
          className={["transported-good",`${isStarting ? "starting " + getInvertedDirection(entity.entryDirection) : ""}`, `${isEnding ? "ending " + leavingDirection : ""}`].join(' ')}
          style={{ display: shouldHaveItem ? undefined : "none" }}
          aria-hidden="true"
        />);
      })
      }
    </div>
  );
}
