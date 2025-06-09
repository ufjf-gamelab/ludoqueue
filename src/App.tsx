import { useState } from "react";
import "./App.css";

type GraphType = {
  nodes: string[];
  connections: [string, string][];
}
const g: GraphType = {
  nodes: ["Apple", "Grape", "Banana"],
  connections: [
    ["Apple", "Grape"],
    ["Apple", "Banana"],
    ["Grape", "Banana"],
    ["Banana", "Apple"],
    ["Banana", "Cashew"],
  ],
}
function App() {
  const [graphData, setGraphData] = useState<GraphType>(g);
  const adjacencyList = createAdjacencyList(graphData);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            const isPresent = graphData.connections.some(([from, to]) => {
              return from === "Cashew" && to === "Durian" || from === "Durian" && to === "Cashew";
            });
            if (isPresent) return;
            graphData.connections.push(["Durian", "Cashew"]);
            setGraphData({...graphData});
          }}
        >
          click me
        </button>
        <h2>Nodes</h2>
        <ul>
          {graphData.nodes.map((nodeID) => (
            <li>{nodeID}</li>
          ))}
        </ul>
        <h2>Connections</h2>
        <ul>
          {graphData.connections.map(([from, to]) => (
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
function createAdjacencyList(graphData: GraphType) {
  const adj: Map<string, string[]> = new Map();
  graphData.nodes.forEach((node) => {
    adj.set(node, []);
  });
  graphData.connections.forEach(([from, to]) => {
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
