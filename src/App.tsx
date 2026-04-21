import "./App.css";
import { useGame } from "./Provider";
import Counter from "./Counter";
import { convertGameToGraph } from "./GameGraph/GraphMethods";
import FluxBoard from "./FluxBoard/FluxBoard";
import GraphElementsList from "./GameGraph/GraphElementsList";
import { useEffect, useMemo, useState } from "react";
import { DataChanger } from "./datas/DataChanger";
import GraphReactFlow from "./ReactFlow/Graph";

function App() {
  const { game } = useGame()!;

  useEffect(() => {
    if (game.entities.size > 0 || game.time > 0) {
      const gameToSave = {
        ...game,
        entities: Array.from(game.entities.entries()), //tem que converter pra array se nao quebra
      };
      localStorage.setItem("game", JSON.stringify(gameToSave));
    }
  }, [game]);

  const classicGraph = useMemo(
    () => convertGameToGraph(game),
    [game.entities.size, game.data],
  );
  const [selectedTab, setSelectedTab] = useState<"game" | "graph">("game");

  return (
    <>
      <div className="NavBar">
        <button
          className={selectedTab === "game" ? "Selected" : ""}
          onClick={() => setSelectedTab("game")}
        >
          Tabuleiro
        </button>
        <button
          className={selectedTab === "graph" ? "Selected" : ""}
          onClick={() => setSelectedTab("graph")}
        >
          Estatisticas das Conexoes
        </button>
        <span className="separator">|</span>
        <Counter></Counter>
        <span className="separator">|</span>
        <DataChanger></DataChanger>
      </div>
      {selectedTab === "game" && (
        <>
          <FluxBoard></FluxBoard>
        </>
      )}
      {selectedTab === "graph" && (
        <>
          <h1> Grafo de Conexoes: </h1>
          <div className="Graph">
            <GraphReactFlow></GraphReactFlow>
            <GraphElementsList graph={classicGraph} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
