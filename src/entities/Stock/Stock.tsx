import type { EntityStockType } from "../EntitiesTypes";
import "../EntitiesCards.css";
import type { AnchorStyle } from "../Source/SourceCard";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div
      key={entity.id}
      className="Card"
      style={
        {
          position: "absolute",
          positionAnchor: `${"--anchor-" + entity.id}`,
          positionArea: "end end",
          positionTry: "end start, start start, start end",
        } as AnchorStyle
      }
    >
      <div className="CardTitle">{entity.id}</div>
      <progress value={entity.val} max={entity.max} style={{ width: "100%" }} />
      <div className="CardSubtitle">
        {entity.val} / {entity.max}
      </div>
      <div className="CardWarning">Doesnt have cooldown</div>
    </div>
  );
}
