import { useState } from "react";
import "./App.css";

function App() {
  const [nodes, setNodes] = useState<string[]>(["Apple", "Grape", "Banana"]);
  const [connections, setConnections] = useState<[string, string][]>([
    ["Apple", "Grape"],
    ["Apple", "Banana"],
    ["Grape", "Banana"],
    ["Banana", "Apple"],
    ["Banana", "Cashew"],
  ]);
  const adjacencyList = createAdjacencyList(nodes, connections);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            const isPresent = connections.some(([from, to]) => {
              return from === "Cashew" && to === "Durian" || from === "Durian" && to === "Cashew";
            });
            if (isPresent) return;
            connections.push(["Durian", "Cashew"]);
            setConnections([...connections]);
          }}
        >
          click me
        </button>
        <h2>Nodes</h2>
        <ul>
          {nodes.map((nodeID) => (
            <li>{nodeID}</li>
          ))}
        </ul>
        <h2>Connections</h2>
        <ul>
          {connections.map(([from, to]) => (
            <li>
              {from}&rarr;
              {to}
            </li>
          ))}
        </ul>
        <h2>Adjacency List</h2>
        <ul>
          {Array.from(adjacencyList.entries()).map(([nodeID, adjacencies]) => (
            <li>
              {nodeID}{" "}
              <ul>
                {adjacencies.map((targetNode) => (
                  <li>{targetNode}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
function createAdjacencyList(nodes: string[], connections: [string, string][]) {
  const adj: Map<string, string[]> = new Map();
  nodes.forEach((node) => {
    adj.set(node, []);
  });
  connections.forEach(([from, to]) => {
    if (!adj.get(from)) {
      adj.set(from, []);
    }
    if (!adj.get(to)) {
      adj.set(to, []);
    }
    const adjFrom = adj.get(from);
    const adjTo = adj.get(to);
    if (!adjFrom?.includes(to)) {
      adjFrom?.push(to);
    }

    if (!adjTo?.includes(from)) {
      adjTo?.push(from);
    }
  });
  return adj;
}
export default App;
