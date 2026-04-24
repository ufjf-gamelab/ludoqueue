import { useEffect, useState, useRef } from "react";
import "./SourceSprite.css";
import type { EntitySourceType } from "../../entities/EntitiesTypes";

export function SourceSprite({ entity }: { entity: EntitySourceType }) {
  const [animating, setAnimating] = useState(false);
  const lastSeenTime = useRef(0);

  useEffect(() => {
    const newestGood = entity.goods[entity.goods.length - 1];
    if (!newestGood || newestGood.time <= lastSeenTime.current) return;
    lastSeenTime.current = newestGood.time;
    setAnimating(false);
    const timeout = setTimeout(() => setAnimating(true), 10);
    return () => clearTimeout(timeout);
  }, [entity.goods]);

  return (
    <div className={`sourcesprite ${animating ? "animate-source" : ""}`} />
  );
}
