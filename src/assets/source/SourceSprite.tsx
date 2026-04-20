import { useEffect, useState } from "react";
import "./spritesheet.css"
const TOTAL_FRAMES = 31;
const FRAME_TIME = 1000 / TOTAL_FRAMES;

export function SourceSprite() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % TOTAL_FRAMES);
    }, FRAME_TIME);

    return () => clearInterval(id);
  }, []);

  const col = frame % 9;
  const row = Math.floor(frame / 9);

  const x = -(col * 72);
  const y = -(row * 110);

  return (
    <div
      className="sprite"
      style={{ backgroundPosition: `${x}px ${y}px` }}
    />
  );
}
