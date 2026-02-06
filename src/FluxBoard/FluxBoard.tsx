import { useRef, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "../Provider";
import type { EntityType } from "../entities/EntitiesTypes";
import Tile from "../entities/Tile";
import ToolBar from "./ToolBar";
import EditorMenu from "./EditorMenu";

export default function FluxBoard() {
  const CELL_WIDTH = 55;
  const NUM_ROWS = 9;
  const NUM_COLS = 9;
  const { game, dispatch } = useGame()!;

  useState<EntityType | null>(null);

  const ref = useRef(null);

  return (
    <div className="flux-board">
      <div
        ref={ref}
        className="game-board"
        onClick={(e) => {
          if (ref.current === null) return;
          const grid = ref.current as HTMLDivElement;
          const x = Math.floor(
            (e.clientX - grid.getBoundingClientRect().x) / CELL_WIDTH
          );
          const y = Math.floor(
            (e.clientY - grid.getBoundingClientRect().y) / CELL_WIDTH
          );

          dispatch({ type: "pointing", x, y });
        }}
        style={{
          gridTemplateColumns: `repeat(${NUM_COLS}, ${CELL_WIDTH}px)`,
          gridTemplateRows: `repeat(${NUM_ROWS}, ${CELL_WIDTH}px)`,
        }}
      >
        {Array.from(game.entities.values()).map(
          (entity) =>
            entity && (
              <Tile
                key={entity.id}
                entity={entity}
                selected={entity.id === game.selected?.id}
              />
            )
        )}
      </div>
      <div>
      <ToolBar />
      <EditorMenu editor={game.editor}></EditorMenu>
      </div>
    </div>
  );
}
