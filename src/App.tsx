import { useReducer, useRef, useState } from "react";
import "./App.css";
import type { GraphType } from "./types";
import R3fForceGraph, { type GraphMethods } from "r3f-forcegraph";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import SpriteText from "three-spritetext";
import { gameReducer, initialState } from "./Provider";

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
  const [game, dispatch] = useReducer(gameReducer, initialState);
  const adjacencyList = createAdjacencyList(game);
  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");

  return (
    <>
      <h1>Vite + React</h1>
      <Canvas flat camera={{ position: [0, 0, 80], far: 800 }}>
        <TrackballControls />
        <color attach="background" args={[0, 0, 0.01]} />
        <ambientLight color={0xcccccc} intensity={Math.PI} />
        <directionalLight intensity={0.6 * Math.PI} />
        <Graph graphData={game} />
      </Canvas>
      <div className="card">
        <label>
          Source:{" "}
          <input
            type="text"
            name="source"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
            }}
          />
        </label>
        <label>
          Target:{" "}
          <input
            type="text"
            name="target"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
            }}
          />
        </label>
        <button
          onClick={() => {
            dispatch({ type: "create link", source, target });
          }}
        >
          Ligar
        </button>
        <button
          onClick={() => {
            dispatch({ type: "delete link", source, target });
          }}
        >
          Desligar
        </button>
        <h2>Nodes</h2>
        <ul>
          {game.nodes.map((node) => (
            <li key={node.id}>{node.id}</li>
          ))}
        </ul>
        <h2>Connections</h2>
        <ul>
          {game.links.map(({ source: s, target: t }) => {
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
    adj.set(node.id, []);
  });
  graphData.links.forEach(({ source, target }) => {
    if (!adj.get(source)) {
      adj.set(source, []);
    }
    if (!adj.get(target)) {
      adj.set(target, []);
    }
    const adjFrom = adj.get(source);
    const adjTo = adj.get(target);
    if (!adjFrom?.includes(target)) {
      adjFrom?.push(target);
    }

    if (!adjTo?.includes(source)) {
      adjTo?.push(source);
    }
  });
  return adj;
}
export default App;
