import type { EntityType } from "./EntitiesTypes";
import "./Tile.css";
import Toolset from "./Toolset.tsx";
import Source from "./Source/SourceTile.tsx";
import { useGame } from "../Provider.tsx";
import TransporterTile from "./Transport/TransporterTile.tsx";
import Stock from "./Stock/StockTile.tsx";
import ConsumerTile from "./Consumer/ConsumerTile.tsx";
import SplitterTile from "./Splitter/SplitterTile.tsx";
import MergerTile from "./Merger/MergerTile.tsx";

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
        return <ConsumerTile key={entity.id} entity={entity} />;
      case "stock":
        return <Stock key={entity.id} entity={entity} />;
      case "transport":
        return <TransporterTile key={entity.id} entity={entity} />;
      case "splitter":
        return <SplitterTile key={entity.id} entity={entity} />;
      case "merger":
        return <MergerTile key={entity.id} entity={entity} />;
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
