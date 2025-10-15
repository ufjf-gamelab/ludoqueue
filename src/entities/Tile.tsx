import { useState } from "react";
import type { EntityType } from "./EntitiesTypes";
import "./Tile.css";
import { TransportIcons, EntityIcons } from "./Icons";
import Toolset from "./Toolset.tsx";
import Source from "./Source/SourceTile.tsx";
import { useGame } from "../Provider.tsx";

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

export default function Tile({ entity, selected }: { entity: EntityType, selected: boolean }) {
  const [isClicked, setIsClicked] = useState(false);
  const { game, dispatch } = useGame()!;
  const renderEntity = (entity: EntityType) => {
    switch (entity?.type) {
      case "source":
        return <Source entity={entity} />;
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
          <div className="stockMinimized">
            <div>
              {EntityIcons[entity.type]}
              {entity.val === entity.max ? (
                <p> Stock full! </p>
              ) : (
                <p> {entity.val} items on stock. </p>
              )}
            </div>
            <progress value={entity.val} max={entity.max}></progress>
          </div>
        );
      case "transport":
        return (
          <div className="transportMinimized">
            <div
              style={{
                gridColumn: "2/2",
                gridRow: "2/2",
                placeSelf: "center",
                fontSize: "200%",
              }}
            >
              {TransportIcons[entity.direction]}
            </div>
            <div style={{ gridColumn: "3/3" }}>{entity.val}</div>
          </div>
        );
    }
  };

  return (
    <div
      className="tile"
      onClick={() => {
        //setIsClicked(!isClicked);

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
