import { useRef } from "react";
import "./FluxBoard.css";
import { useGame } from "../Provider";
import Tile from "../entities/Tile";
import ToolBar from "./ToolBar";
import EditorMenu from "../Editor/EditorMenu";

export default function FluxBoard() {
  const CELL_WIDTH = 75;
  const NUM_ROWS = 8;
  const NUM_COLS = 8;
  const { game, dispatch } = useGame()!;

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
            (e.clientX - grid.getBoundingClientRect().x) / CELL_WIDTH,
          );
          const y = Math.floor(
            (e.clientY - grid.getBoundingClientRect().y) / CELL_WIDTH,
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
                tileSize={CELL_WIDTH}
              />
            ),
        )}
      </div>
      <div>
        <ToolBar />
        <EditorMenu editor={game.editor}></EditorMenu>
      </div>
    </div>
  );
}
