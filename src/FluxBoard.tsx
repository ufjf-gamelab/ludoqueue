import { useRef, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "./Provider";
import type { GameActionCreateStock } from "./entities/Stock/StockActions";
import type { EntityType } from "./entities/EntitiesTypes";
import type { GameActionCreateSource } from "./entities/Source/SourceActions";
import type { GameActionCreateConsumer } from "./entities/Consumer/ConsumerActions";
import type { GameActionCreateTransport } from "./entities/Transport/TransportActions";
import Tile from "./entities/Tile";
import { EntityIcons } from "./entities/Icons";

export default function FluxBoard() {
  const rows = 5;
  const cols = 5;
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
    <div className="flux-board" >
      <div
      ref={ref}
        className="game-board"
        onClick={(e)=>{
      const x = Math.floor((e.clientX - ref.current.getBoundingClientRect().x)/100);
      const y = Math.floor((e.clientY - ref.current.getBoundingClientRect().y)/100);

      //alert(`${x} ${y}`)
      handleClick(x,y, undefined);
      e.stopPropagation();

    }}
        style={{
          /* nao sei se seria a melhor ideia definir o tamanho fixo no grid do tabuleiro */
          gridTemplateColumns: `repeat(${cols}, 100px)`,
          gridTemplateRows: `repeat(${rows}, 100px)`,
        }}
      >
        {Array.from(game.entities.values()).map(entity=>(
              <div
                key={`${entity.id}`}
                className="tile-wrapper"
                style={{ gridColumn: `${entity.x+1}`, gridRow: `${entity.y+1}` }}
                // onClick={() => handleClick(i,j, entity)}
              >
                {entity && <Tile entity={entity} />}
              </div>
            )
          )
        }
      </div>
      <div className="tool-selector">
        <button className="stock" onClick={() => setSelectedTool("stock")}>
          {EntityIcons["stock"]}
        </button>
        <button className="consumer" onClick={() => setSelectedTool("consumer")}>
          {EntityIcons["consumer"]}
        </button>
        <button className="source" onClick={() => setSelectedTool("source")}>
          {EntityIcons["source"]}
        </button>
        <button className="transport" onClick={() => setSelectedTool("transport")}>
          {EntityIcons["transport"]}
        </button>
      </div>
    </div>
  );
}
