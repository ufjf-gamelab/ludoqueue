import { type EntityTransportType } from "../EntitiesTypes";
import "../Toolset.css";
import "./TransporterTile.css";
import { TransportSprite } from "../../assets/transport/TransportSprite";

export default function TransporterTile({ entity }: { entity: EntityTransportType }) {
  return (
    <div className="transporter-tile">
      <TransportSprite entity={entity} />
    </div>
  );
}
