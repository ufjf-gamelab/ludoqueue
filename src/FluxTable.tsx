import { useEffect, useState } from "react";
import "./FluxTable.css";
import { type EntityType } from "./entities/EntitiesTypes";
import { useGame } from "./Provider";
import type { GameActionCreateStock } from "./entities/Stock/StockActions";

export default function FluxTable() {
  const rows = 5;
  const cols = 5;
  const { game, dispatch } = useGame()!;
  const [board, setBoard] = useState<(EntityType | null)[]>(
    Array(rows * cols).fill(null) //ajuda do gpt nessa. Devo rencher de vazios pra ter um array de itens vazios. Existe maneira melhor de obter nisso?
  );
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const newBoard = Array(rows * cols).fill(null); // Criar novo board do zero
    game.entities.forEach((entity) => {
      const entityPos = entity.row * cols + entity.col;
      newBoard[entityPos] = entity; // Sempre atualiza a posição
    });
    setBoard(newBoard);
  }, [game]); // Só atualiza quando o número de entidades mudar
  const handleClick = (row: number, col: number) => {
    switch (selected) {
      case "stock": {
        const action: GameActionCreateStock = {
          type: "create stock",
          max: 5,
          val: 0,
          row: row,
          col: col,
        };
        dispatch(action);
      }
    }
  };

  return (
    <div className="FluxTable">
      <div className="Table">
        {Array.from({ length: rows }).map(
          (
            _,
            i //gera tabuleiro a partir da quantidade de itens
          ) =>
            Array.from({ length: cols }).map((_, j) => {
              const pos = i * cols + j;
              const entity = board[pos];

              return (
                <button key={`${i}-${j}`} onClick={() => handleClick(i, j)}>
                  {entity ? entity.name : ""}
                </button>
              );
            })
        )}
      </div>
      <div className="Selector">
        <button onClick={() => setSelected("stock")}>Stock</button>
        <button onClick={() => setSelected("consumer")}>Consumer</button>
        <button onClick={() => setSelected("source")}>Source</button>
        <button onClick={() => setSelected("transport")}>Transport</button>
      </div>
    </div>
  );
}
