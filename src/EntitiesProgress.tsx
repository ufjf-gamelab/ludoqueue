import Source from "./entities/Source/Source";
import type { EntitySourceType, GameType } from "./types";

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
    </div>
  );
}
