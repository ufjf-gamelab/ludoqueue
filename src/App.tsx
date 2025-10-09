import "./App.css";
import { useGame } from "./Provider";
import Counter from "./Counter";
import { convertGameToGraph } from "./GameGraph/GraphMethods";
import Graph from "./GameGraph/Graph";
import FluxBoard from "./FluxBoard";
import GraphElementsList from "./GameGraph/GraphElementsList";
import { useMemo } from "react";

function App() {
  const { game } = useGame()!;
  const classicGraph = useMemo(
    () => convertGameToGraph(game),
    [game.entities.size]
  );
  return (
    <>
      <Counter></Counter>
      <FluxBoard></FluxBoard>
      <h1> Grafo de Conexoes: </h1>
      <div className="Graph">
        <Graph graph={classicGraph}></Graph>
        <GraphElementsList graph={classicGraph} />
      </div>
    </>
  );
}

export default App;
