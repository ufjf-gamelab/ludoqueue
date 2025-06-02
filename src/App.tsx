import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [nodes, setNodes] = useState<Map<string, string[]>>(
    new Map([
      ["Apple", ["Grape", "Banana"]],
      ["Grape", ["Banana"]],
      ["Banana", ["Apple"]],
    ])
  );
  nodes.set("Durian", ["Banana"]);
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
            // setCount((count) => count + 1);
            if (nodes.get("Grape")?.includes("Apple")) {
              return;
            }
            const newNodes = new Map(nodes);
            newNodes.set("Grape", [...(newNodes.get("Grape") || []), "Apple"]);
            setNodes(newNodes);
          }}
        >
          count is {count}
        </button>
        <ul>
          {Array.from(nodes.entries()).map(([nodeID, adjacencies]) => (
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
