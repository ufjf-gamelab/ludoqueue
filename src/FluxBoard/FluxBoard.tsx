import { useRef, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "../Provider";
import Tile from "../entities/Tile";
import ToolBar from "./ToolBar";
import EditorMenu from "../Editor/EditorMenu";
import { initialState } from "../datas/initialState";
import { splitterComplexoData } from "../datas/splitterComplexo";
import { mergerComplexoData } from "../datas/mergerComplexo";
import { mergerSimplesData } from "../datas/mergerSimples";
import { splitterSimplesData } from "../datas/splitterSimples";

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
                switch(e.target.value){
                  case("initialState"):{
                    dispatch({ type: "change game data", data: initialState });
                    break;
                  }
                  case("splitter simples"):{
                    dispatch({ type: "change game data", data: splitterSimplesData });
                    break;
                  }
                  case("splitter complexo"):{
                    dispatch({ type: "change game data", data: splitterComplexoData });
                    break;
                  }
                  case("merger simples"):{
                    dispatch({ type: "change game data", data: mergerSimplesData });
                    break;
                  }
                  case("merger complexo"):{
                    dispatch({ type: "change game data", data: mergerComplexoData });
                    break;
                  }
                }
              }}
            >
              <option value="initialState">InitialData</option>
              <option value="splitter simples">Splitter Simples</option>
              <option value="splitter complexo">Splitter Complexo</option>
              <option value="merger simples">Merger Simples</option>
              <option value="merger complexo">Merger Complexo</option>
            </select>
          </label>
        </div>
        <ToolBar />
        <EditorMenu editor={game.editor}></EditorMenu>
      </div>
    </div>
  );
}
