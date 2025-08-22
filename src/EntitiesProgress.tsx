import type { GameType } from "./types";
import React from "react";

export default function EntitiesProgress({ game }: { game: GameType }) {
  const entitiesList: React.ReactElement[] = []; // conferir

  game.entities.forEach((entity) => {
    entitiesList.push(
      <div
        key={entity.id}
        style={{
          background: "rgba(0, 0, 0, 0.1)",
          minWidth: "120px",
        }}
      >
        <div style={{ marginBottom: "5px" }}>{entity.id}</div>
        <progress
          value={entity.val}
          max={entity.max}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: "5px", textAlign: "center" }}>
          {entity.val} / {entity.max}
        </div>
      </div>
    );
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "5px",
      }}
    >
      {entitiesList}
    </div>
  );
}
