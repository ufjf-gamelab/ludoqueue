import type { EntitySourceType } from "../EntitiesTypes";
import "../EntitiesCards.css";
import type { AnchorStyle } from "../Tile";

export default function Source({ entity }: { entity: EntitySourceType }) {
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
      <progress value={entity.cooldown} style={{ width: "100%" }} />
      <div className="CardSubtitle">
        Cooldown: {entity.cooldown} / Rate: {entity.rate}
      </div>
    </div>
  );
}
