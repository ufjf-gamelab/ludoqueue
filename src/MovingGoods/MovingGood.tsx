import type { MovingGoodType } from "../entities/EntitiesTypes";
import { useGame } from "../Provider";
import "./MovingGood.css";
export default function MovingGood({ good }: { good: MovingGoodType }) {
  const { game } = useGame()!;

  const source = game.entities.get(good.source!);
  const target = game.entities.get(good.target!);

  if (!source || !target) return null;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  let dir = "";
  if (dx === 1) dir = "right";
  else if (dx === -1) dir = "left";
  else if (dy === 1) dir = "down";
  else if (dy === -1) dir = "up";
  return (
    <div
      className={"transported-goods-container"}
      style={{
        gridColumn: `${source.x - game.offset.x + 1}`,
        gridRow: `${source.y - game.offset.y + 1}`,
      }}
    >
      <span
        className={["transported-good", `${good.goodType}`,"ending",
          dir,].join(" ")}
      ></span>
    </div>
  );
}
