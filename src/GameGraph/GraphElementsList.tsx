import type { GraphType } from "../types";
import { createAdjacencyList, findAllCycles } from "../GameGraph/GraphMethods";
import "./GraphElementsLists.css";
import { useState } from "react";

export default function GraphElementsList({ graph }: { graph: GraphType }) {
  const adjacencyList = createAdjacencyList(graph);
  const [showGraphElement, setShowGraphElement] = useState(false);
  const cycles = findAllCycles(graph);

  return (
    <div className="ElementsUI">
      {showGraphElement ? (
        <button
          onClick={() => {
            setShowGraphElement(false);
          }}
        >
          Ocultar lista de elementos
        </button>
      ) : (
        <button
          onClick={() => {
            setShowGraphElement(true);
          }}
        >
          Exibir lista de elementos
        </button>
      )}
      {showGraphElement ? (
        <div className="GraphElements">
          <div>
            <h2>Nodes</h2>
            <ul>
              {graph.nodes().map((node) => {
                const attributes = graph.getNodeAttributes(node);
                return <li key={node}>{attributes.label}</li>;
              })}
            </ul>
          </div>
          <div>
            <h2>Connections</h2>
            <ul>
              {graph.edges().map((edge) => {
                const source = graph.source(edge);
                const target = graph.target(edge);

                return (
                  <li key={edge}>
                    {source} &rarr; {target}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2>Adjacency List</h2>
            <ul>
              {Array.from(adjacencyList.entries()).map(
                ([nodeID, adjacencies]) => (
                  <li key={nodeID}>
                    {nodeID}{" "}
                    <ul>
                      {adjacencies.map((targetNode) => (
                        <li key={`${nodeID}-${targetNode}`}>{targetNode}</li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h2>Status</h2>
            {cycles.length === 0 ? (
              <p>O grafo não contém ciclos.</p>
            ) : (
              <>
                <p>O grafo contém {cycles.length} ciclo(s):</p>
                <ul>
                  {cycles.map((cycle, i) => (
                    <li key={i}>{cycle.join(" → ")}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
