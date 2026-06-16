import { useGame } from "../Provider";
import type { MovingGoodType, EntityType } from "../entities/EntitiesTypes";
import MovingGood from "./MovingGood";
import "./MovingGoodsLayer.css";

function hasMovingGoods(
  e: EntityType,
): e is Extract<EntityType, { movingGoods: MovingGoodType[] }> {
  return "movingGoods" in e;
}

export default function MovingGoodsLayer({
  numRows,
  numCols,
  size,
}: {
  numRows: number;
  numCols: number;
  size: number;
}) {
  const { game } = useGame()!;
  const goods = Array.from(game.entities.values())
    .filter(
      (e) =>
        (e.type === "transport" ||
          e.type === "splitter" ||
          e.type === "merger") &&
        e.x >= game.offset.x &&
        e.x < game.offset.x + numCols &&
        e.y >= game.offset.y &&
        e.y < game.offset.y + numRows,
    )
    .filter(hasMovingGoods)
    .flatMap((e) =>
      e.movingGoods.filter((g: MovingGoodType) => g.source && g.target),
    );
  return (
    <div
      className="goods-layer"
      style={{
        gridTemplateColumns: `repeat(${numCols}, ${size}px)`,
        gridTemplateRows: `repeat(${numRows}, ${size}px)`,
      }}
    >
      {goods.map((g, i) => (
        <MovingGood key={`${g.source}-${g.target}-${g.time}-${i}`} good={g} />
      ))}
    </div>
  );
}
