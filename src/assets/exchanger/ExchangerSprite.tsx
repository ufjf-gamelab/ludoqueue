import { useEffect, useState } from "react";
import "./ExchangerSprite.css";
import type { EntityExchangerType } from "../../entities/EntitiesTypes";

export function ExchangerSprite({ entity }: { entity: EntityExchangerType }) {
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (entity.movingGoods.length === 0) return;
    setAnimating(false);
    const timeout = setTimeout(() => setAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, [entity.movingGoods.length]);

  return (
    <div
      className={`exchanger-sprite ${animating ? "animate-exchanger" : ""}`}
    />
  );
}
