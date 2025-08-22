import Source from "./entities/Source/Source";
import type { EntityMineType, GameType } from "./types";
import React from "react";

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
      {game.mines.map((mine) => {return <Source entity={game.entities.get(mine) as EntityMineType} />})}
    </div>
  );
}
