import type { EntityType } from "./EntitiesTypes";
import type { AnchorStyle } from "./Tile";
import { TransportIcons } from "./Icons";
import "./Toolset.css";

export default function Toolset({ entity }: { entity: EntityType }) {
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
      {entity.type === "stock" ? (
        <div className="ToolsetWarning">Doesnt have cooldown</div>
      ) : (
        <>
          <progress value={entity.cooldown} style={{ width: "100%" }} />
          <div className="ToolsetSubtitle">
            Cooldown: {entity.cooldown} / Rate: {entity.rate}
          </div>
        </>
      )}
      {entity.type === "transport" && (
        <div className="CardSubtitle">
          Direction: {TransportIcons[entity.direction]}
          {TransportIcons[entity.direction]}
          {TransportIcons[entity.direction]}
        </div>
      )}
    </div>
  );
}
