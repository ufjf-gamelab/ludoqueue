import { useEffect, useState } from "react";
import "./TransportSprite.css";
import type { EntityTransportType } from "../../entities/EntitiesTypes";

export function TransportSprite({ entity }: { entity: EntityTransportType }) {
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (entity.movingGoods.length === 0) return;
    setAnimating(false);
    const timeout = setTimeout(() => setAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, [entity.movingGoods.length]);

  return (
    <div
      className={`transport-sprite ${["transport-direction", entity.entryDirection, entity.leavingDirection, animating? "animate" : ""].join("-")}`}
    />
  );
}
