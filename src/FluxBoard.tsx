import { useState } from "react";
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

  //seletores de criacao
  const [selected, setSelected] = useState<string | null>(null);
  const [newTransportSource, setNewTransportSource] =
    useState<EntityType | null>(null);

  const handleClick = (
    x: number,
    y: number,
    entity: EntityType | undefined
  ) => {
    switch (selected) {
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
    <div className="Game">
      <div
        className="Board"
        style={{
          /* nao sei se seria a melhor ideia definir o tamanho fixo no grid do tabuleiro */
          gridTemplateColumns: `repeat(${cols}, 200px)`,
          gridTemplateRows: `repeat(${rows}, 200px)`,
        }}
      >
        {Array.from({ length: rows }).map((_, i) =>
          Array.from({ length: cols }).map((_, j) => {
            const entity = Array.from(game.entities.values()).find(
              (entity) => entity.x === i && entity.y === j
            );

            return (
              <div
                key={`${i}-${j}`}
                className="TileWrapper" //trocar classname, usando esse so pra reaproveitar estilo p teste
                style={{ gridColumn: `${i + 1}`, gridRow: `${j + 1}` }}
                onClick={() => handleClick(i,j, entity)}
              >
                {entity && <Tile entity={entity} />}
              </div>
            );
          })
        )}
      </div>
      <div className="Selector">
        <button className="stock" onClick={() => setSelected("stock")}>
          {EntityIcons["stock"]}
        </button>
        <button className="consumer" onClick={() => setSelected("consumer")}>
          {EntityIcons["consumer"]}
        </button>
        <button className="source" onClick={() => setSelected("source")}>
          {EntityIcons["source"]}
        </button>
        <button className="transport" onClick={() => setSelected("transport")}>
          {EntityIcons["transport"]}
        </button>
      </div>
    </div>
  );
}
