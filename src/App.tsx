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
    <div className="Game">
      <div className="GameBoard">
        <h1>Tabuleiro: </h1>
        <FluxBoard></FluxBoard>
      </div>
      <div className="GameStatistics">
        <h1>Estastisticas do Jogo: </h1>
        <Counter></Counter>
        <h2> Lista de Entidades: </h2>
        <EntitiesProgress game={game} />
      </div>
    </div>
    <h1> Grafo de Conexoes: </h1>
    <div className="Graph">
      <Graph graph={classicGraph}></Graph>
      <GraphElementsList graph={classicGraph} />
    </div>
    </>
  );
}

export default App;
