import { useRef, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "../Provider";
import Tile from "../entities/Tile";
import ToolBar from "./ToolBar";
import EditorMenu from "../Editor/EditorMenu";
import { initialState } from "../data";
import { initialState2 } from "../data2";
import { initialState3 } from "../data3";

export default function FluxBoard() {
  const CELL_WIDTH = 55;
  const NUM_ROWS = 9;
  const NUM_COLS = 9;
  const { game, dispatch } = useGame()!;
  const [selectedData, setSelectedData] = useState("data1");

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
              />
            ),
        )}
      </div>
      <div>
        <div
          style={{
            marginTop: "5px",
            fontSize: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Select Data:</span>
            <select
              value={selectedData}
              onChange={(e) => {
                setSelectedData(e.target.value);
                if (e.target.value === "data1") {
                  dispatch({ type: "change game data", data: initialState });
                } else if (e.target.value === "data2") {
                  dispatch({ type: "change game data", data: initialState2 });
                } else {
                  dispatch({ type: "change game data", data: initialState3 });
                }
              }}
            >
              <option value="data1">Data1</option>
              <option value="data2">Data2</option>
              <option value="data3">Data3</option>
            </select>
          </label>
        </div>
        <ToolBar />
        <EditorMenu editor={game.editor}></EditorMenu>
      </div>
    </div>
  );
}
