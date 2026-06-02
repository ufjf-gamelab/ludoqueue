import { useRef, useEffect, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "../Provider";
import Tile from "../entities/Tile";
import MovingGoodsLayer from "../MovingGoods/MovingGoodsLayer";

export default function FluxBoard() {
  const CELL_WIDTH = 75;
  const boardRef = useRef(null);
  const { game, dispatch } = useGame()!;

  const [numRows, setNumRows] = useState(8);
  const [numCols, setNumCols] = useState(8);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const BOARD_PADDING = 20;
      const availableWidth = rect.width - BOARD_PADDING;
      const availableHeight = rect.height - BOARD_PADDING;
      setNumCols(Math.max(1, Math.floor(availableWidth / CELL_WIDTH)));
      setNumRows(Math.max(1, Math.floor(availableHeight / CELL_WIDTH)));
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="flux-board" ref={containerRef}>
      <div
        ref={boardRef}
        className="game-board"
        tabIndex={0}
        onClick={(e) => {
          if (boardRef.current === null) return;
          const grid = boardRef.current as HTMLDivElement;
          const x = Math.floor(
            (e.clientX - grid.getBoundingClientRect().x) / CELL_WIDTH,
          );
          const y = Math.floor(
            (e.clientY - grid.getBoundingClientRect().y) / CELL_WIDTH,
          );

          dispatch({
            type: "pointing",
            x: x + game.offset.x,
            y: y + game.offset.y,
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") dispatch({ type: "move map right" });
          else if (e.key === "ArrowLeft") dispatch({ type: "move map left" });
          else if (e.key === "ArrowUp") dispatch({ type: "move map up" });
          else if (e.key === "ArrowDown") dispatch({ type: "move map down" });
          else if (e.key === "w") dispatch({ type: "move map up" });
          else if (e.key === "a") dispatch({ type: "move map left" });
          else if (e.key === "s") dispatch({ type: "move map down" });
          else if (e.key === "d") dispatch({ type: "move map right" });
          else if (e.key === "W") dispatch({ type: "move map up" });
          else if (e.key === "A") dispatch({ type: "move map left" });
          else if (e.key === "S") dispatch({ type: "move map down" });
          else if (e.key === "D") dispatch({ type: "move map right" });
        }}
        style={{
          gridTemplateColumns: `repeat(${numCols}, ${CELL_WIDTH}px)`,
          gridTemplateRows: `repeat(${numRows}, ${CELL_WIDTH}px)`,
          backgroundPosition: `${-game.offset.x * CELL_WIDTH}px ${-game.offset.y * CELL_WIDTH}px`,
        }}
      >
        {Array.from(game.entities.values()).map((entity) => {
          if (
            entity.x >= game.offset.x &&
            entity.x < game.offset.x + numCols &&
            entity.y >= game.offset.y &&
            entity.y < game.offset.y + numRows
          )
            return (
              <Tile
                key={entity.id}
                entity={entity}
                selected={entity.id === game.selected?.id}
                tileSize={CELL_WIDTH}
              />
            );
        })}
        <MovingGoodsLayer
          numRows={numRows}
          numCols={numCols}
          size={CELL_WIDTH}
        />
        <div className="map-controls">
          <button
            className="up"
            onClick={() => dispatch({ type: "move map up" })}
          >
            ↑
          </button>
          <button
            className="left"
            onClick={() => dispatch({ type: "move map left" })}
          >
            ←
          </button>
          <button
            className="right"
            onClick={() => dispatch({ type: "move map right" })}
          >
            →
          </button>
          <button
            className="down"
            onClick={() => dispatch({ type: "move map down" })}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
