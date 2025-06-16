import { useRef, useState } from "react";
import "./App.css";
import type { GraphType } from "./types";
import R3fForceGraph from "r3f-forcegraph";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls } from "@react-three/drei";
import SpriteText from 'three-spritetext';

const g: GraphType = {
  nodes: [
    { id: "apple", name: "Apple", val: 0 },
    { id: "grape", name: "Grape", val: 0 },
    { id: "banana", name: "Banana", val: 0 },
    { id: "cashew", name: "Cashew", val: 0 },
  ],
  links: [
    { source: "apple", target: "grape" },
    { source: "apple", target: "banana" },
    { source: "grape", target: "banana" },
    { source: "banana", target: "apple" },
    { source: "banana", target: "cashew" },
  ],
};

function Graph({ graphData }) {
  const fgRef = useRef();
  useFrame(() => fgRef.current.tickFrame());
  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={graphData}
      nodeThreeObject={(node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = "white";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}

function App() {
  const [graphData, setGraphData] = useState<GraphType>(g);
  const adjacencyList = createAdjacencyList(graphData);
  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const graphRef = useRef(structuredClone(graphData));
  return (
    <>
      <h1>Vite + React</h1>
      <Canvas flat camera={{ position: [0, 0, 1000], far: 8000 }}>
        <TrackballControls />
        <color attach="background" args={[0, 0, 0.01]} />
        <ambientLight color={0xcccccc} intensity={Math.PI} />
        <directionalLight intensity={0.6 * Math.PI} />
        <Graph graphData={graphRef.current} />
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
            const isPresent = graphData.links.some(
              ({ source: sourceLink, target: targetLink }) => {
                return (
                  (sourceLink === source && targetLink === target) ||
                  (sourceLink === target && targetLink === source)
                );
              }
            );
            if (isPresent) return;
            graphData.links.push({ source, target });
            const newGraph = { ...graphData };
            setGraphData(newGraph);
            graphRef.current=structuredClone(newGraph);
          }}
        >
          Ligar
        </button>
        <button
          onClick={() => {
            const isPresent = graphData.links.some(
              ({ source: sourceLink, target: targetLink }) => {
                return (
                  (sourceLink === source && targetLink === target) ||
                  (sourceLink === target && targetLink === source)
                );
              }
            );
            if (!isPresent) return;
            graphData.links = graphData.links.filter((link) => {
              return !(
                (link.source == source && link.target == target) ||
                (link.target == source && link.source == target)
              );
            });
            const newGraph = { ...graphData };
            setGraphData(newGraph);
            graphRef.current=structuredClone(newGraph);
          }}
        >
          Desligar
        </button>
        <button
          onClick={() => {
            const isPresent = graphData.links.some(({ source, target }) => {
              return (
                (source === "cashew" && target === "durian") ||
                (source === "durian" && target === "cashew")
              );
            });
            if (isPresent) return;
            graphData.links.push({ source: "durian", target: "cashew" });
            setGraphData({ ...graphData });
          }}
        >
          click me
        </button>
        <h2>Nodes</h2>
        <ul>
          {graphData.nodes.map((node) => (
            <li key={node.id}>{node.id}</li>
          ))}
        </ul>
        <h2>Connections</h2>
        <ul>
          {graphData.links.map(({ source:s, target:t }) => {

            return (
            <li key={`${s}--${t}`}>
              {s}&rarr;
              {t}
            </li>
          )})}
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
