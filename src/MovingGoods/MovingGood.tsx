import type { MovingGoodType } from "../entities/EntitiesTypes";
import { useGame } from "../Provider";
import "./MovingGood.css";
export default function MovingGood({ good }: { good: MovingGoodType }) {
  const { game } = useGame()!;

  const source = game.entities.get(good.source!);
  const target = game.entities.get(good.target!);

  if (!source || !target) return null;
  return (
    <div
      className={"transported-goods-container"}
      style={{
        gridColumn: `${source.x + 1}`,
        gridRow: `${source.y + 1}`,
      }}
    >
      <span
        className={["transported-good", `${good.goodType}`].join(" ")}
      ></span>
    </div>
  );
}
