import type { GraphType } from "../types";
import { createAdjacencyList } from "./GraphMethods";
import "./GraphElementsLists.css";
import NodeElement from "./NodeElement";
import { useState } from "react";

export default function GraphElementsList({ graph }: { graph: GraphType }) {
  const adjacencyList = createAdjacencyList(graph);
  const [showGraphElement, setShowGraphElement] = useState(false);
  

  return (
    <div className="ElementsUI">
        {showGraphElement ? (
          <button
            onClick={() => {
              setShowGraphElement(false);
            }}
          >
            Ocultar lista de elementos do banheiro
          </button>
        ) : (
          <button
            onClick={() => {
              setShowGraphElement(true);
            }}
          >
            Exibir lista de elementos do banheiro
          </button>
        )}
        {showGraphElement ? <div className="GraphElements">
      <div>
        <h2>Nodes</h2>
        <ul>
          {graph.nodes.map((node) => (
            <NodeElement key={node.id} node={node} />
          ))}
        </ul>
      </div>
      <div>
        <h2>Connections</h2>
        <ul>
          {graph.links.map(({ source: s, target: t }) => {
            return (
              <li key={`${s}--${t}`}>
                {s} &rarr; {t}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
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
    </div> : null}
      </div>
    
  );
}
