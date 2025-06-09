import { useState } from "react";
import "./App.css";

type NodeIDType = string;

type NodeType = {
  id: NodeIDType;
  name: string;
  val: number;
};

type LinkType = {
  source: NodeIDType;
  target: NodeIDType;
}

type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};
const g: GraphType = {
  nodes: [
    { id: "apple", name: "Apple", val: 0 },
    { id: "grape", name: "Grape", val: 0 },
    { id: "banana", name: "Banana", val: 0 },
  ],
  links: [
    {source:"apple",target: "grape"},
    {source:"apple",target: "banana"},
    {source:"grape",target: "banana"},
    {source:"banana",target: "apple"},
    {source:"banana",target: "cashew"},
  ],
};
function App() {
  const [graphData, setGraphData] = useState<GraphType>(g);
  const adjacencyList = createAdjacencyList(graphData);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            const isPresent = graphData.links.some(({source, target}) => {
              return (
                (source === "cashew" && target === "durian") ||
                (source === "durian" && target === "cashew")
              );
            });
            if (isPresent) return;
            graphData.links.push({source:"durian", target:"cashew"});
            setGraphData({ ...graphData });
          }}
        >
          click me
        </button>
        <h2>Nodes</h2>
        <ul>
          {graphData.nodes.map((node) => (
            <li>{node.id}</li>
          ))}
        </ul>
        <h2>Connections</h2>
        <ul>
          {graphData.links.map(({source, target}) => (
            <li>
              {source}&rarr;
              {target}
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
    adj.set(node.id, []);
  });
  graphData.links.forEach(({source, target}) => {
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
