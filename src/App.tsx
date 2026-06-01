import "./App.css";
import { useGame } from "./Provider";
import Counter from "./Counter";
import { convertGameToGraphology } from "./GameGraph/GraphMethods";
import FluxBoard from "./FluxBoard/FluxBoard";
import GraphElementsList from "./GameGraph/GraphElementsLists";
import { useEffect, useMemo, useState } from "react";
import { DataChanger } from "./datas/DataChanger";
import ReactFlowGraph from "./GameGraph/ReactFlow/ReactFlowGraph";
import { Sidebar } from "./FluxBoard/Sidebar";

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

  const graph = useMemo(() => convertGameToGraphology(game), [game]);
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
        <div className= "GameContainer">
          <FluxBoard></FluxBoard>
          <Sidebar></Sidebar>
        </div>
      )}
      {selectedTab === "graph" && (
        <div
          className="StatisticsContainer"
        >
          <div style={{ flex: 1, display: "flex", flexDirection: "column"}}>
            <h2> Grafo de Conexoes: </h2>
            <ReactFlowGraph></ReactFlowGraph>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <h2> Estatísticas das Conexões: </h2>
            <GraphElementsList graph={graph} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
