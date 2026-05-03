import type { GraphType } from "../GameTypes";
import { createAdjacencyList, findAllCycles } from "./GraphMethods";
import "./GraphElementsLists.css";
import { connectedComponents } from "graphology-components";

export default function GraphElementsList({ graph }: { graph: GraphType }) {
  const adjacencyList = createAdjacencyList(graph);
  const cycles = findAllCycles(graph);
  const components = connectedComponents(graph);

  return (
    <div className="ElementsUI">
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
            {components.length === 1 ? (
              <p>O grafo é conexo.</p>
            ) : (
              <p>O grafo tem {components.length} componentes conectados.</p>
            )}
          </div>
        </div>
    </div>
  );
}
