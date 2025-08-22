import type { GameType } from "./types";
import React from "react";

export default function EntitiesProgress({ game }: { game: GameType }) {
  const entitiesList: React.ReactElement[] = []; // conferir 

  game.entities.forEach((entity) => {
    entitiesList.push(
      <div key={entity.id} className="entity-item">
        <div>{entity.id}</div>
        <progress
            value = {entity.val}
            max = {entity.max}
        />
        <div>
          {entity.val} / {entity.max}
        </div>
      </div>
    );
  });

  return <div className="entities-progress">{entitiesList}</div>;
}
