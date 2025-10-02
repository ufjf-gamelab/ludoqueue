import { useState } from "react";
import type { EntityType } from "./EntitiesTypes";
import "./Tile.css";
import { TransportIcons, EntityIcons } from "./Icons";
import Toolset from "./Toolset.tsx";

export interface AnchorStyle extends React.CSSProperties {
  anchorName?: string;
  positionAnchor?: string;
  positionArea?: string;
  positionTryFallbacks?: string;
}

export default function Tile({ entity }: { entity: EntityType }) {
  const [isClicked, setIsClicked] = useState(false);
  const renderEntity = (entity: EntityType) => {
    switch (entity?.type) {
      case "source":
        return (
          <div className="sourceMinimized">
            {EntityIcons[entity.type]}
            <progress value={entity.val} max={entity.max}></progress>
            {entity.val} / {entity.max}
          </div>
        );
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
      className="Tile"
      onClick={() => setIsClicked(!isClicked)}
      style={
        {
          anchorName: `${"--anchor-" + entity.id}`,
          gridColumn: entity.x + 1,
          gridRow: entity.y + 1,
        } as AnchorStyle
      }
    >
      {renderEntity(entity)}
      {isClicked && <Toolset entity={entity} />}

    </div>
  );
}
