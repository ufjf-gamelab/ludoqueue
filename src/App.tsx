import "./App.css";
import { Canvas } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import { useGame } from "./Provider";
import Counter from "./Counter";
import EntitiesProgress from "./entities/EntitiesProgress";
import {
  convertGameToGraph,
  createAdjacencyList,
} from "./GameGraph/GraphMethods";
import Graph from "./GameGraph/Graph";
import NodeElement from "./GameGraph/NodeElement";

function App() {
  const { game } = useGame()!;

  if (!game) return null;
  const classicGraph = convertGameToGraph(game);
  const adjacencyList = createAdjacencyList(classicGraph);
  return (
    <>
      <h1>Vite + React</h1>
      <Counter></Counter>
      <Canvas flat camera={{ position: [0, 0, 80], far: 800 }}>
        <TrackballControls />
        <color attach="background" args={[0, 0, 0.01]} />
        <ambientLight color={0xcccccc} intensity={Math.PI} />
        <directionalLight intensity={0.6 * Math.PI} />
        <Graph graphData={classicGraph} />
      </Canvas>
      <div className="card">
        <EntitiesProgress game={game} />
        <h2>Nodes</h2>
        <ul>
          {classicGraph.nodes.map((node) => (
            <NodeElement key={node.id} node={node} />
          ))}
        </ul>
        <h2>Connections</h2>
        <ul>
          {classicGraph.links.map(({ source: s, target: t }) => {
            return (
              <li key={`${s}--${t}`}>
                {s}&rarr;
                {t}
              </li>
            );
          })}
        </ul>
        <h2>Adjacency List</h2>
        <ul>
          {Array.from(adjacencyList.entries()).map(([nodeID, adjacencies]) => (
            <li key={nodeID}>
              {nodeID}{" "}
              <ul>
                {adjacencies.map((targetNode) => (
                  <li key={`${nodeID}-${targetNode}`}>{targetNode}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
