import { useRef } from "react";
import "./App.css";
import type { GraphType } from "./types";
import R3fForceGraph, { type GraphMethods } from "r3f-forcegraph";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import SpriteText from "three-spritetext";
import { useGame, useGameDispatch } from "./Provider";
import GraphEditor from "./GraphEditor";
import Counter from "./Counter";

function Graph({ graphData }: { graphData: GraphType }) {
  const fgRef = useRef<GraphMethods>(undefined);
  const clonedData = structuredClone(graphData);
  useFrame(() => fgRef.current?.tickFrame());

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={clonedData}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(String(node.id));
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}

function App() {
  const game = useGame();
  const dispatch = useGameDispatch();
  const adjacencyList = createAdjacencyList(game);

  return (
    <>
      <h1>Vite + React</h1>
      <Counter></Counter>
      <Canvas flat camera={{ position: [0, 0, 80], far: 800 }}>
        <TrackballControls />
        <color attach="background" args={[0, 0, 0.01]} />
        <ambientLight color={0xcccccc} intensity={Math.PI} />
        <directionalLight intensity={0.6 * Math.PI} />
        <Graph graphData={game} />
      </Canvas>
      <div className="card">
        <GraphEditor dispatch={dispatch}></GraphEditor>
        <h2>Nodes</h2>
        <ul>
          {game.nodes.map((node) => (
            <NodeElement node={node} />
          ))}
        </ul>
        <h2>Connections</h2>
        <ul> 
          {game.nodes.map(({ source: s, target: t }) => { //ERRO em nao processar apenas transports. ajuda para consertar.
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
function createAdjacencyList(graphData: GraphType) {
  const adj: Map<string, string[]> = new Map();
  graphData.nodes.forEach((node) => {
    if (node.type != "transport") {
      adj.set(node.id, []);
    } else {
      if (!adj.get(node.source)) {
        adj.set(node.source, []);
      }
      if (!adj.get(node.target)) {
        adj.set(node.target, []);
      }
      const adjFrom = adj.get(node.source);
      //const adjTo = adj.get(target);
      if (!adjFrom?.includes(node.target)) {
        adjFrom?.push(node.target);
      }

      //if (!adjTo?.includes(source)) {
      //  adjTo?.push(source);
      //}
    }
  });
  return adj;
}
export default App;

function NodeElement({ node }) {
  return (
    <li key={node.id}>
      {node.id}:{JSON.stringify(node)}
    </li>
  );
}
