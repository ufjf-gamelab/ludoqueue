import type { EntityTransportType } from "../EntitiesTypes";
import "../Toolset.css";
import "./TransporterTile.css";
import { TransportIcons } from "../Icons";

export default function TransporterTile({ entity }: { entity: EntityTransportType }) {
  const spanKey = String(Math.random());
  return (
    <div className="transporter-tile">
      {TransportIcons[entity.direction]}
      <progress value={entity.val} max={entity.max} title={`${entity.val}/${entity.max}`} />
      <span key={spanKey} className={["transported-good", entity.direction].join(' ')} aria-hidden="true" />
    </div>
  );
}
