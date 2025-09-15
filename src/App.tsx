import "./App.css";
import { useGame } from "./Provider";
import Counter from "./Counter";
import EntitiesProgress from "./entities/EntitiesProgress";
import { convertGameToGraph } from "./GameGraph/GraphMethods";
import Graph from "./GameGraph/Graph";
import FluxBoard from "./FluxBoard";
import GraphElementsList from "./GameGraph/GraphElementsList";
import { useMemo } from "react";

function App() {
  const { game } = useGame()!;
  const classicGraph = useMemo(() => convertGameToGraph(game), [game.entities.size]);
  return (
    <>
      <div className="GameBoard">
        <FluxBoard></FluxBoard>
      </div>
        <Counter></Counter>
        <EntitiesProgress game={game} />
    <h1> Grafo de Conexoes: </h1>
    <div className="Graph">
      <Graph graph={classicGraph}></Graph>
      <GraphElementsList graph={classicGraph} />
    </div>
    </>
  );
}

export default App;
