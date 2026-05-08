import "./TransportSprite.css";
import type { EntityTransportType } from "../../entities/EntitiesTypes";

export function TransportSprite({ entity }: { entity: EntityTransportType }) {
  return (
    <div
      className={`transport-sprite ${["transport-direction", entity.entryDirection, entity.leavingDirection, "animate"].join("-")}`}
    />
  );
}
