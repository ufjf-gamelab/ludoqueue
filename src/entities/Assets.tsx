import type { EntityTransportType } from "./EntitiesTypes";
import "./Assets.css";

//Transport assets
export function TransporterSprites(entity: EntityTransportType) {
    return <div className={`transporter-sprite ${entity.direction}`}></div>;
}
