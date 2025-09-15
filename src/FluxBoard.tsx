import { useMemo, useState, type JSX } from "react";
import "./FluxBoard.css";
import { useGame } from "./Provider";
import type { GameActionCreateStock } from "./entities/Stock/StockActions";
import { GiMiner, GiTakeMyMoney } from "react-icons/gi";
import { BsMinecartLoaded } from "react-icons/bs";
import { BsSafe2 } from "react-icons/bs";

import type { EntityType } from "./entities/EntitiesTypes";
import type { GameActionCreateSource } from "./entities/Source/SourceActions";
import type { GameActionCreateConsumer } from "./entities/Consumer/ConsumerActions";
import type { GameActionCreateTransport } from "./entities/Transport/TransportActions";
import SourceCard from "./entities/Source/SourceCard";
import StockCard from "./entities/Stock/StockCard";
import ConsumerCard from "./entities/Consumer/ConsumerCard";
import TransportCard from "./entities/Transport/TransportCard";

const entityIcons = new Map<string, JSX.Element>([
  ["stock", <BsSafe2 />],
  ["consumer", <GiTakeMyMoney />],
  ["source", <GiMiner />],
  ["transport", <BsMinecartLoaded />],
]);

export default function FluxBoard() {
  const rows = 5;
  const cols = 5;
  const { game, dispatch } = useGame()!;
  const board = useMemo<(EntityType | null)[]>(() => {
    const newBoard = Array(rows * cols).fill(null);
    game.entities.forEach((entity) => {
      const entityPos = entity.x * cols + entity.y;
      newBoard[entityPos] = entity;
    });
    return newBoard;
  }, [game.entities, rows, cols]);

  //seletores de criacao
  const [selected, setSelected] = useState<string | null>(null);
  const [newTransportSource, setNewTransportSource] = useState<EntityType | null>(null);



  const handleClick = (x: number, y: number) => {
    const position = x * cols + y;
    switch (selected) {
      case "stock": {
        if (!board[position]) {
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
        if (!board[position]) {
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
        if (!board[position]) {
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
      case "transport": {
        if (board[position]) {
          if (!newTransportSource) {
            setNewTransportSource(board[position]);
          } else {
            const newTransportTarget = board[position];
            if (newTransportTarget.x === newTransportSource.x) { //mesma horizontal
              if (newTransportTarget.y - newTransportSource.y == 2) { //sentido pra direita
                const newEntityPos = newTransportTarget.x * cols + (newTransportTarget.y - 1);
                if (!board[newEntityPos]) {
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.x,
                    y: newTransportTarget.y - 1,
                    direction:"right",
                  };
                  dispatch(action);
                  setNewTransportSource(null); //redefine source na criacao de transport
                }
              } else if (newTransportTarget.y - newTransportSource.y == -2) { //sentido pra esquerda
                const newEntityPos = newTransportTarget.x * cols + (newTransportTarget.y + 1);
                if (!board[newEntityPos]) {
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.x,
                    y: newTransportTarget.y + 1,
                    direction: "left",
                  };
                  dispatch(action);
                  setNewTransportSource(null);
                }
              }
            } else if (newTransportTarget.y === newTransportSource.y) {
              //mesma vertical
              if (newTransportTarget.x - newTransportSource.x == 2) { //sentido pra baixo
                const newEntityPos = newTransportTarget.x - 1 * cols + newTransportTarget.y;
                if (!board[newEntityPos]) {
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.x - 1,
                    y: newTransportTarget.y,
                    direction: "down",
                  };
                  dispatch(action);
                  setNewTransportSource(null);
                }
              }
              if (newTransportTarget.x - newTransportSource.x == -2) { //sentido pra cima
                const newEntityPos = newTransportTarget.x + 1 * cols + newTransportTarget.y;
                if (!board[newEntityPos]) {
                  const action: GameActionCreateTransport = {
                    type: "create transport",
                    max: 1,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.x + 1,
                    y: newTransportTarget.y,
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
    }
  };

  return (
    <div className="FluxBoard">
      <div className="Board">
        {Array.from({ length: rows }).map((_, i) =>
            Array.from({ length: cols }).map((_, j) => {
                const boardPos = i * cols + j;
                const entity = board[boardPos];
                switch (entity?.type) {
                  case "source":
                    return (
                        <SourceCard entity={entity} onClick={() => handleClick(i, j)}/>
                    );
                  case "stock":
                    return (
                      <StockCard entity={entity} key={boardPos} onClick={() => handleClick(i, j)}/>
                    );
                  case "consumer":
                    return (
                      <ConsumerCard entity={entity} key={boardPos} onClick={() => handleClick(i, j)}/>
                    );
                  case "transport":
                    return (
                        <TransportCard entity={entity} key={boardPos} />
                    );
                  default:
                    return (<button className="empty" onClick={() => handleClick(i, j)}></button>);
                }
})
      )}
      </div>
      <div className="Selector">
        <button className="stock" onClick={() => setSelected("stock")}>
          {entityIcons.get("stock")}
        </button>
        <button className="consumer" onClick={() => setSelected("consumer")}>
          {entityIcons.get("consumer")}
        </button>
        <button className="source" onClick={() => setSelected("source")}>
          {entityIcons.get("source")}
        </button>
        <button className="transport" onClick={() => setSelected("transport")}>
          {entityIcons.get("transport")}
        </button>
      </div>
    </div>
  );
}
