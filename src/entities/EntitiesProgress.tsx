import Source from "./Source/Source";
import type { EntitySourceType, EntityStockType, GameType } from "../types";
import Stock from "./Stock/Stock";

export default function EntitiesProgress({ game }: { game: GameType }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "5px",
      }}
    >
      {game.sources.map((source) => {
        return (
          <Source entity={game.entities.get(source) as EntitySourceType} />
        );
      })}
      {game.stocks.map((stock) => {
        return (
          <Stock entity={game.entities.get(stock) as EntityStockType} />
        );
      })}
    </div>
  );
}
