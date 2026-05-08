import { useGame } from "../Provider";
import MovingGood from "./MovingGood";
import "./MovingGoodsLayer.css";

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
        e.type === "transport" || e.type === "splitter" || e.type === "merger",
    )
    .flatMap((e) => e.movingGoods.filter((g) => g.source && g.target));

  return (
    <div
      className="goods-layer"
      style={{
        gridTemplateColumns: `repeat(${numCols}, ${size}px)`,
        gridTemplateRows: `repeat(${numRows}, ${size}px)`,
      }}
    >
      {goods.map((g) => (
        <MovingGood key={`${g.source}-${g.target}-${g.time}`} good={g} />
      ))}
    </div>
  );
}
