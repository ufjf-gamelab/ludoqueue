import type { EntityTransportType, MovingGoodType } from "../EntitiesTypes";
import "../Toolset.css";
import "./TransporterTile.css";
import { TransportIcons } from "../Icons";

export default function TransporterTile({ entity }: { entity: EntityTransportType }) {
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
  return (
    <div className="transporter-tile">
      {TransportIcons[entity.direction]}
      <progress value={entity.val} max={entity.max} title={`${entity.val}/${entity.max}`} />
      {movingGoods.map((movingGood) => {
        if (movingGood.target == entity)
          isStarting = true;
        if (movingGood.source == entity)
          isEnding = true;
        return (<span
          key={spanKey}
          className={["transported-good", entity.direction, `${isStarting ? "starting" : ""}`, `${isEnding ? "ending" : ""}`].join(' ')}
          style={{ display: shouldHaveItem ? undefined : "none" }}
          aria-hidden="true"
        />);
      })
      }
    </div>
  );
}
