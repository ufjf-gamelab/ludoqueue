import { getInvertedDirection, type EntityTransportType, type MovingGoodType } from "../EntitiesTypes";
import "../Toolset.css";
import "./TransporterTile.css";
import { TransportSprite } from "../../assets/transport/TransportSprite";

export default function TransporterTile({ entity }: { entity: EntityTransportType }) {
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
  return (
    <div className="transporter-tile">
      {/*{TransportIcons.get(`${entity.entryDirection}-${entity.leavingDirection}`)}
      <progress value={entity.goods.length} max={entity.max} title={`${entity.goods.length}/${entity.max}`} />*/}
      <TransportSprite entity={entity} />
      {movingGoods.map((movingGood) => {
        if (movingGood.target == entity.id)
          isStarting = true;
        if (movingGood.source == entity.id)
          isEnding = true;
        return (<span
          key={spanKey}
          className={["transported-good",`${isStarting ? "starting " + getInvertedDirection(entity.entryDirection) : ""}`, `${isEnding ? "ending " + entity.leavingDirection : ""}`, `${entity.movingGoods[0].goodType}`].join(' ')}
          style={{ display: shouldHaveItem ? undefined : "none" }}
          aria-hidden="true"
        />);
      })
      }
    </div>
  );
}
