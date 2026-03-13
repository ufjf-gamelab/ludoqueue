import "./SplitterTile.css";
import { getInvertedDirection, type EntitySplitterType, type MovingGoodType } from "../EntitiesTypes";
import "../Toolset.css";
import { DirectionIcons, EntityIcons } from "../Icons";

export default function SplitterTile({ entity }: { entity: EntitySplitterType }) {
  const spanKey = String(Math.random());
  let isStarting: boolean = false;
  let isEnding: boolean = false;
  let shouldHaveItem: boolean = false;
  const movingGoods: MovingGoodType[] = entity.movingGoods;
  if (movingGoods.length > 0) {
    shouldHaveItem = true;
  }
  if (entity.goods.length > 0) {
    shouldHaveItem = true;
  }
  const leavingDirection = calculateLeavingDirection(entity);

  function calculateLeavingDirection(entity: EntitySplitterType): string {
    switch (entity.nextTargetIndex){
        case 1:{ //ta 1 2 e 0 pq next e o ultimo somado com 1
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
        case 2:{
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
        case 0:{
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
    <div className="splitter-tile">
        {EntityIcons.splitter}
      <progress value={entity.goods.length} max={entity.max} title={`${entity.goods.length}/${entity.max}`} />
      {(entity.entryDirection === "up") && <div>
        <div className="position-up">{DirectionIcons.down}</div>
        <div className="position-down">{DirectionIcons.down}</div>
        <div className="position-right">{DirectionIcons.right}</div>
        <div className="position-left">{DirectionIcons.left}</div>
        </div>}
        {(entity.entryDirection === "down") && <div>
        <div className="position-up">{DirectionIcons.up}</div>
        <div className="position-down">{DirectionIcons.up}</div>
        <div className="position-right">{DirectionIcons.right}</div>
        <div className="position-left">{DirectionIcons.left}</div>
        </div>}
        {(entity.entryDirection === "right") && <div>
        <div className="position-up">{DirectionIcons.up}</div>
        <div className="position-down">{DirectionIcons.down}</div>
        <div className="position-right">{DirectionIcons.left}</div>
        <div className="position-left">{DirectionIcons.left}</div>
        </div>}
        {(entity.entryDirection === "left") && <div>
        <div className="position-up">{DirectionIcons.up}</div>
        <div className="position-down">{DirectionIcons.down}</div>
        <div className="position-right">{DirectionIcons.right}</div>
        <div className="position-left">{DirectionIcons.right}</div>
        </div>}
      {movingGoods.map((movingGood) => {
        if (movingGood.target == entity.id)
          isStarting = true;
        if (movingGood.source == entity.id)
          isEnding = true;
        return (<span
          key={spanKey}
          className={["transported-good",`${isStarting ? "starting " + getInvertedDirection(entity.entryDirection) : ""}`, `${isEnding ? "ending " + leavingDirection : ""}`,`${entity.movingGoods[0].goodType}`].join(' ')}
          style={{ display: shouldHaveItem ? undefined : "none" }}
          aria-hidden="true"
        />);
      })
      }
    </div>
  );
}
