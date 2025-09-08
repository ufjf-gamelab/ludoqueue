import { useEffect, useState } from "react";
import "./FluxBoard.css";
import { useGame } from "./Provider";
import type { GameActionCreateStock } from "./entities/Stock/StockActions";
import { GiMiner } from "react-icons/gi";
import type { EntityType } from "./entities/EntitiesTypes";
import type { GameActionCreateSource } from "./entities/Source/SourceActions";
import type { GameActionCreateConsumer } from "./entities/Consumer/ConsumerActions";
import type { GameActionCreateTransport } from "./entities/Transport/TransportActions";

export default function FluxBoard() {
  const rows = 5;
  const cols = 5;
  const { game, dispatch } = useGame()!;
  const [board, setBoard] = useState<(EntityType | null)[]>(
    Array(rows * cols).fill(null) //ajuda do gpt nessa. Devo rencher de vazios pra ter um array de itens vazios. Existe maneira melhor de obter nisso?
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [newTransportSource, setNewTransportSource] = useState<EntityType | null>(null);
  useEffect(() => {
    const newBoard = Array(rows * cols).fill(null);
    game.entities.forEach((entity) => {
      const entityPos = entity.x * cols + entity.y;
      newBoard[entityPos] = entity;
    });
    setBoard(newBoard);
  }, [game.entities.size]);
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
                    max: 5,
                    rate: 1,
                    source: newTransportSource.id,
                    target: newTransportTarget.id,
                    x: newTransportTarget.x,
                    y: newTransportTarget.y - 1,
                  };
                  dispatch(action);
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
        {Array.from({ length: rows }).map(
          (
            _,
            i //gera tabuleiro a partir da quantidade de itens
          ) =>
            Array.from({ length: cols }).map((_, j) => {
              const boardPos = i * cols + j;
              const entity = board[boardPos];

              return (
                <button
                  className={entity?.type || "empty"}
                  key={`${i}-${j}`}
                  onClick={() => handleClick(i, j)}
                >
                  {entity?.name || ""}
                </button>
              );
            })
        )}
      </div>
      <div className="Selector">
        <button className="stock" onClick={() => setSelected("stock")}>
          Stock
        </button>
        <button className="consumer" onClick={() => setSelected("consumer")}>
          Consumer
        </button>
        <button className="source" onClick={() => setSelected("source")}>
          <GiMiner />
        </button>
        <button className="transport" onClick={() => setSelected("transport")}>
          Transport
        </button>
      </div>
    </div>
  );
}
