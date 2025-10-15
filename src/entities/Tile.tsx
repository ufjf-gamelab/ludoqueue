import { useState } from "react";
import type { EntityType } from "./EntitiesTypes";
import "./Tile.css";
import { TransportIcons, EntityIcons } from "./Icons";
import Toolset from "./Toolset.tsx";
import Source from "./Source/SourceTile.tsx";
import { useGame } from "../Provider.tsx";
import TransporterTile from "./Transport/TransporterTile.tsx";
import Stock from "./Stock/StockTile.tsx";

export interface AnchorStyle extends React.CSSProperties {
  anchorName?: string;
  positionAnchor?: string;
  positionArea?: string;
  positionTryFallbacks?: string;
}

/**
 *
 * Responsible for rendering an specialized tile based on the entity type and its popup
 *
 */

export default function Tile({
  entity,
  selected,
}: {
  entity: EntityType;
  selected: boolean;
}) {
  const { game, dispatch } = useGame()!;
  const renderEntity = (entity: EntityType) => {
    switch (entity?.type) {
      case "source":
        return <Source key={entity.id} entity={entity} />;
      case "consumer":
        return (
          <div>
            <div>
              {EntityIcons[entity.type]}
              <p>Consuming in {entity.cooldown} seconds</p>
            </div>
            <progress value={entity.val} max={entity.max}></progress>
          </div>
        );
      case "stock":
        return (
          <Stock key={entity.id} entity={entity} />
        );
      case "transport":
        return <TransporterTile key={entity.id} entity={entity} />;
    }
  };

  return (
    <div
      className="tile"
      onClick={() => {
        if (game.selected?.id !== entity?.id) {
          dispatch({ type: "select entity", entityId: entity?.id || null });
        } else {
          dispatch({ type: "select entity", entityId: null });
        }
      }}
      style={
        {
          gridColumn: `${entity.x + 1}`,
          gridRow: `${entity.y + 1}`,
          anchorName: `${"--anchor-" + entity.id}`,
        } as AnchorStyle
      }
    >
      {renderEntity(entity)}
      {selected && <Toolset entity={entity} />}
    </div>
  );
}
