import type { EntityStockType } from "../EntitiesTypes";
import "../EntitiesCards.css"

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
     <div
      key={entity.id}
      className="Card"
    >
      <div className="CardTitle">{entity.id}</div>
      <progress value={entity.val} max={entity.max} style={{ width: "100%" }} />
      <div className="CardSubtitle">
        {entity.val} / {entity.max}
      </div>
      <div className="CardWarning">
        Doesnt have cooldown
      </div>
    </div>
  );
}
