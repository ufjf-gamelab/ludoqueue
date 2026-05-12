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
          <h2>
            <span>Nodes</span>
            <span className="info-icon" title="Lista de todos os nós do grafo">
              ℹ️
            </span>
          </h2>
          <ul>
            {graph.nodes().map((node) => {
              const attributes = graph.getNodeAttributes(node);
              return <li key={node}>{attributes.label}</li>;
            })}
          </ul>
        </div>
        <div>
          <h2>
            <span>Connections</span>
            <span
              className="info-icon"
              title="Lista de todas as conexões entre nós"
            >
              ℹ️
            </span>
          </h2>
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
          <h2>
            <span>Adjacency List</span>
            <span
              className="info-icon"
              title="Representação de adjacência do grafo"
            >
              ℹ️
            </span>
          </h2>
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
          <h2>
            <span>Status</span>
            <span
              className="info-icon"
              title="Informações sobre ciclos e conectividade"
            >
              ℹ️
            </span>
          </h2>
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
