import { useEffect, useRef, useState } from "react";
import "./SourceSprite.css"
import type { EntitySourceType } from "../../entities/EntitiesTypes";
const TOTAL_FRAMES = 31;
const FRAME_TIME = 1000 / TOTAL_FRAMES;

export function SourceSprite({ entity }: { entity: EntitySourceType }) {
  const [frame, setFrame] = useState(0);
  const lastSeenTime = useRef(0);
  
  useEffect(() => {
      const newestGood = entity.goods[entity.goods.length - 1];
      if (!newestGood) return;
      if (newestGood.time <= lastSeenTime.current) return;
      lastSeenTime.current = newestGood.time;
      let current = 0;
      const play = () => {
        setFrame(current);
        current++;
    
        if (current < TOTAL_FRAMES) {
          setTimeout(play, FRAME_TIME);
        }
      };
    play();
  }, [entity.goods]);

  const col = frame % 9;
  const row = Math.floor(frame / 9);

  const x = -(col * 72);
  const y = -(row * 110);


  return (
    <div
      className="sourcesprite"
      style={{ backgroundPosition: `${x}px ${y}px` }}
    />
  );
}
