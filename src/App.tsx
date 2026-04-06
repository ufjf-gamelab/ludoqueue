import "./App.css";
import { useGame } from "./Provider";
import Counter from "./Counter";
import { convertGameToGraph } from "./GameGraph/GraphMethods";
import Graph from "./GameGraph/Graph";
import FluxBoard from "./FluxBoard/FluxBoard";
import GraphElementsList from "./GameGraph/GraphElementsList";
import { useMemo, useState } from "react";
import { DataChanger } from "./datas/DataChanger";

function App() {
  const { game } = useGame()!;
  const classicGraph = useMemo(
    () => convertGameToGraph(game),
    [game.entities.size,game.data],
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
            <Graph graph={classicGraph}></Graph>
            <GraphElementsList graph={classicGraph} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
