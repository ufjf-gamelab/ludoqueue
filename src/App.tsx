import { useState } from "react";
import "./App.css";

function App() {
  const [nodes, setNodes] = useState<string[]>(["Apple", "Grape", "Banana"]);
  const [connections, setConnections] = useState([
    ["Apple", "Grape"],
    ["Apple", "Banana"],
    ["Grape", "Banana"],
    ["Banana", "Apple"],
    ["Banana", "Cashew"]
  ]);
  const [adjacencyList, setAdjacencyList] = useState<Map<string, string[]>>(
    new Map([
      ["Apple", ["Grape", "Banana"]],
      ["Grape", ["Banana"]],
      ["Banana", ["Apple"]],
    ])
  );

  adjacencyList.set("Durian", ["Banana"]);
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            if (adjacencyList.get("Grape")?.includes("Apple")) {
              return;
            }
            const newNodes = new Map(adjacencyList);
            newNodes.set("Grape", [...(newNodes.get("Grape") || []), "Apple"]);
            setAdjacencyList(newNodes);
          }}
        >
          click me
        </button>
        <h2>Nodes</h2>
        <ul>
          {nodes.map((nodeID) => (
            <li>
              {nodeID}
            </li>
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

export default App;
