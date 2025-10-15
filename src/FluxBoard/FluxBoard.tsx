import { useRef, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "../Provider";
import type { GameActionCreateStock } from "../entities/Stock/StockActions";
import type { EntityType } from "../entities/EntitiesTypes";
import type { GameActionCreateSource } from "../entities/Source/SourceActions";
import type { GameActionCreateConsumer } from "../entities/Consumer/ConsumerActions";
import type { GameActionCreateTransport } from "../entities/Transport/TransportActions";
import Tile from "../entities/Tile";
import { EntityIcons } from "../entities/Icons";

export default function FluxBoard() {
  const CELL_WIDTH = 55;
  const NUM_ROWS = 9;
  const NUM_COLS = 9;
  const { game, dispatch } = useGame()!;

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [newTransportSource, setNewTransportSource] =
    useState<EntityType | null>(null);

  const ref = useRef(null);
  const handleClick = (
    x: number,
    y: number,

    entity: EntityType | undefined
  ) => {
    switch (selectedTool) {
      case "stock": {
        if (!entity) {
          const action: GameActionCreateStock = {
            type: "create stock",
            max: 5,
            val: 0,
            x: x,
            y: y,
          };
          dispatch(action);
        }
        break;
      }
      case "source": {
        if (!entity) {
          const action: GameActionCreateSource = {
            type: "create source",
            max: 5,
            val: 0,
            x: x,
            y: y,
          };
          dispatch(action);
        }
        break;
      }
      case "consumer": {
        if (!entity) {
          const action: GameActionCreateConsumer = {
            type: "create consumer",
            max: 5,
            rate: 1,
            x: x,
            y: y,
          };
          dispatch(action);
        }
        break;
      }
      case "transport":
        {
          if (entity) {
            if (!newTransportSource) {
              setNewTransportSource(entity);
            } else {
              const newTransportTarget = entity;
              if (newTransportTarget.y === newTransportSource.y) {
                //mesma horizontal
                if (newTransportTarget.x - newTransportSource.x == 2) {
                  //sentido pra direita
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.y,
                    y: newTransportTarget.x - 1,
                    direction: "right",
                  };
                  dispatch(action);
                  setNewTransportSource(null); //redefine source na criacao de transport
                } else if (newTransportTarget.x - newTransportSource.x == -2) {
                  //sentido pra esquerda
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.y,
                    y: newTransportTarget.x + 1,
                    direction: "left",
                  };
                  dispatch(action);
                  setNewTransportSource(null);
                }
              } else if (newTransportTarget.x === newTransportSource.x) {
                //mesma vertical
                if (newTransportTarget.y - newTransportSource.y == 2) {
                  //sentido pra baixo
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.y - 1,
                    y: newTransportTarget.x,
                    direction: "down",
                  };
                  dispatch(action);
                  setNewTransportSource(null);
                }
                if (newTransportTarget.y - newTransportSource.y == -2) {
                  //sentido pra cima
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.y + 1,
                    y: newTransportTarget.x,
                    direction: "up",
                  };
                  dispatch(action);
                  setNewTransportSource(null);
                }
              }
            }
          }
        }
        break;
    }
  };
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

          handleClick(x, y, undefined);
          
        }}
        style={{
          gridTemplateColumns: `repeat(${NUM_COLS}, ${CELL_WIDTH}px)`,
          gridTemplateRows: `repeat(${NUM_ROWS}, ${CELL_WIDTH}px)`,
        }}
      >
        {Array.from(game.entities.values()).map(
          (entity) => entity && <Tile entity={entity} selected={entity.id === game.selected?.id} />
        )}
      </div>
      <div className="tool-selector">
        <div>Selected: {game.selected?.id}</div>
        <button className="stock" onClick={() => setSelectedTool("stock")}>
          {EntityIcons["stock"]}
        </button>
        <button
          className="consumer"
          onClick={() => setSelectedTool("consumer")}
        >
          {EntityIcons["consumer"]}
        </button>
        <button className="source" onClick={() => setSelectedTool("source")}>
          {EntityIcons["source"]}
        </button>
        <button
          className="transport"
          onClick={() => setSelectedTool("transport")}
        >
          {EntityIcons["transport"]}
        </button>
      </div>
    </div>
  );
}
