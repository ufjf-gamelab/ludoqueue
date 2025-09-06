import type { EntityConsumerType } from "../EntitiesTypes";
import "../EntitiesCards.css"
export default function Consumer({ entity }: { entity: EntityConsumerType }) {
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
      <progress value={entity.cooldown} style={{ width: "100%" }} />
      <div className="CardSubtitle">
        Cooldown: {entity.cooldown} /  Rate: {entity.rate}
      </div>
    </div>
  );
}
