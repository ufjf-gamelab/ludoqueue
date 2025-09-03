import { useState } from "react";
import "./FluxTable.css";
import { type EntityType } from "./entities/EntitiesTypes";
import { useGame } from "./Provider";
import type { GameActionCreateStock } from "./entities/Stock/StockActions";

export default function FluxTable() {
  const rows = 5;
  const cols = 5;
  const { game, dispatch } = useGame()!;
  const [board, setBoard] = useState<(EntityType | null)[]>(
    Array(rows * cols).fill(null)
  ); //ajuda do gpt nessa. Devo rencher de vazios pra ter um array de itens vazios. Existe maneira melhor de obter nisso?
  const [selected, setSelected] = useState<string | null>(null);
  const handleClick = (pos: number) => {
    if (!selected) {
      //nao faz nada se nao selecionou tipo
      return board;
    }
    setBoard((prev) => {
      const newBoard = [...prev];
      if (!newBoard[pos]) {
        // so adiciona se for nulo
        let addedItem;
        switch (selected) {
          case "source": {
            const action: GameActionCreateStock = {
              type: "create stock",
              max: 5,
              val: 0,
            };
            dispatch(action);
            addedItem = game.sources[game.sources.length-1];
          }
        }
        
        newBoard[pos] = game.entities.get(addedItem!) as EntityType;
      }
      return newBoard;
    });
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
                <button key={`${i}-${j}`} onClick={() => handleClick(pos)}>
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
        <button onClick={() => setSelected("transport")}>Stock</button>
      </div>
    </div>
  );
}
