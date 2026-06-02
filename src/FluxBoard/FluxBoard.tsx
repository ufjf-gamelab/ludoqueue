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
        onClick={(e) => {
          if (boardRef.current === null) return;
          const grid = boardRef.current as HTMLDivElement;
          const x = Math.floor(
            (e.clientX - grid.getBoundingClientRect().x) / CELL_WIDTH,
          );
          const y = Math.floor(
            (e.clientY - grid.getBoundingClientRect().y) / CELL_WIDTH,
          );

          dispatch({ type: "pointing", x, y });
        }}
        style={{
          gridTemplateColumns: `repeat(${numCols}, ${CELL_WIDTH}px)`,
          gridTemplateRows: `repeat(${numRows}, ${CELL_WIDTH}px)`,
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
        <MovingGoodsLayer
          numRows={numRows}
          numCols={numCols}
          size={CELL_WIDTH}
        />
      </div>
    </div>
  );
}
