import type { EntityTransportType } from "../EntitiesTypes";
import "../Toolset.css";
import "./TransporterTile.css";
import { EntitySprites } from "../Assets";

export default function TransporterTile({ entity }: { entity: EntityTransportType }) {
  return (
    <div className="transporter-tile">
      {EntitySprites(entity)}
      {/* {TransportIcons[entity.direction]} */}
      {/* <progress value={entity.val} max={entity.max} title={`${entity.val}/${entity.max}`} /> */}
    </div>
  );
}
