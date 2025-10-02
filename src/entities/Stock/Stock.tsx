import type { EntityStockType } from "../EntitiesTypes";
import "../Toolset.css";
import type { AnchorStyle } from "../Tile";

export default function Stock({ entity }: { entity: EntityStockType }) {
  return (
    <div
      key={entity.id}
      className="Toolset"
      style={
        {
          position: "absolute",
          positionAnchor: `${"--anchor-" + entity.id}`,
          positionArea: "end end",
          positionTry: "end start, start start, start end",
        } as AnchorStyle
      }
    >
      <div className="ToolsetTitle">{entity.id}</div>
      <progress value={entity.val} max={entity.max} style={{ width: "100%" }} />
      <div className="ToolsetSubtitle">
        {entity.val} / {entity.max}
      </div>
      <div className="ToolsetWarning">Doesnt have cooldown</div>
    </div>
  );
}
