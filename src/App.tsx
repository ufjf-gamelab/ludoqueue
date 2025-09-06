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
      <FluxBoard></FluxBoard>
      <Counter></Counter>
      <EntitiesProgress game={game} />
      <h2> Grafo de Conexoes: </h2>
      <Graph graph={classicGraph}></Graph>
      <GraphElementsList graph={classicGraph} />
    </>
  );
}

export default App;
