import { useEffect, useState } from "react";
import "./ExchangerSprite.css";
import type { EntityExchangerType } from "../../entities/EntitiesTypes";
const TOTAL_FRAMES = 14;
const FRAME_TIME = 1000 / TOTAL_FRAMES;

export function ExchangerSprite({ entity }: { entity: EntityExchangerType }) {
  const [stateFrame, setStateFrame] = useState(0);

  useEffect(() => {
    if (entity.movingGoods.length === 0) return;

    const interval = setInterval(() => {
      setStateFrame((prev) => (prev + 1) % TOTAL_FRAMES);
    }, FRAME_TIME);
    setStateFrame(0);
    return () => clearInterval(interval);
  }, [entity.movingGoods.length]);

  return <div className={`exchanger-sprite exchanger-sprite-${stateFrame}`} />;
}
