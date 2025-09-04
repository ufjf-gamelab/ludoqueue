import { useState } from "react";
import "./FluxBoard.css";
import { useGame } from "./Provider";
import type { GameActionCreateStock } from "./entities/Stock/StockActions";

export default function FluxTable() {
  const { game, dispatch } = useGame()!;
  const rows = game.rows;
  const cols = game.cols;
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (i: number, j: number) => {
    switch (selected) {
      case "stock": {
        const action: GameActionCreateStock = {
          type: "create stock",
          max: 5,
          val: 0,
          posI: i,
          posJ: j,
        };
        dispatch(action);
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
                const entityID = game.board[boardPos];
                const entity = entityID ? game.entities.get(entityID) : null; // tinha feito com if, mas parece que a boa pratica p evitar erro de ts e assim?

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
        <button className="stock" onClick={() => setSelected("stock")}>Stock</button>
        <button className="consumer" onClick={() => setSelected("consumer")}>Consumer</button>
        <button className="source" onClick={() => setSelected("source")}>Source</button>
        <button className="transport" onClick={() => setSelected("transport")}>Transport</button>
      </div>
    </div>
  );
}
