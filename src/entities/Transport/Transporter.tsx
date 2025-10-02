import type { EntityTransportType } from "../EntitiesTypes";
import "../Toolset.css";
import type { AnchorStyle } from "../Tile";
import { TransportIcons } from "../Icons";

export default function Transport({ entity }: { entity: EntityTransportType }) {
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
      <div className="CardSubtitle">
        Direction: {TransportIcons[entity.direction]}
        {TransportIcons[entity.direction]}
        {TransportIcons[entity.direction]}
      </div>
    </div>
  );
}
