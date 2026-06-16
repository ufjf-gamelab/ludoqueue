import type { GraphType } from "../GameTypes";
import {
  createAdjacencyList,
  createDirectionalAdjacencyList,
  findAllCycles,
  findAllPaths,
} from "./GraphMethods";
import "./GraphElementsLists.css";
import { connectedComponents } from "graphology-components";

export default function GraphElementsList({ graph }: { graph: GraphType }) {
  const adjacencyList = createAdjacencyList(graph);
  const directionalAdjacencyList = createDirectionalAdjacencyList(graph);
  const cycles = findAllCycles(graph);
  const components = connectedComponents(graph);

  return (
    <div className="ElementsUI">
      <div className="GraphElements">
        <div>
          <h2>
            <span>Nodes</span>
            <span
              className="info-icon"
              title="Lista de todos os nós do grafo, em que cada nó é uma peça do jogo."
            >
              ℹ️
            </span>
          </h2>
          <div className="nodes-list">
            {graph.nodes().map((node) => {
              const attributes = graph.getNodeAttributes(node);
              return (
                <div className="node-item" key={node}>
                  {attributes.label}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2>
            <span>Conectividade</span>
            <span
              className="info-icon"
              title="Um grafo é conexo se existe um caminho entre qualquer par de nós. Componentes conectados são subgrafos onde cada par de nós está conectado por um caminho."
            >
              ℹ️
            </span>
          </h2>
          {components.length === 1 ? (
            <p>O grafo é conexo.</p>
          ) : (
            <p>O grafo tem {components.length} componentes conectados.</p>
          )}
        </div>

        {/*
        <div>
          <h2>
            <span>Conexões</span>
            <span
              className="info-icon"
              title="Lista de todas as conexões entre nós, com direção indicada por setas. Cada linha mostra um nó de origem, uma seta e o nó de destino conectado a ele."
            >
              ℹ️
            </span>
          </h2>
            <div className="connections-list">
            {graph.edges().map((edge) => {
              const source = graph.source(edge);
              const target = graph.target(edge);

              return (
                <div key={edge} className="connection-item">
                  <span className="node-label">{source}</span>
                  <span className="arrow">→</span>
                  <span className="connection-nodes">
                    {target}
                  </span>
                </div>
              );
            })}
            </div>
        </div>
*/}

        <div>
          <h2>
            <span> Adjacency List</span>
            <span
              className="info-icon"
              title="Representação de adjacência direcional do grafo. Cada linha mostra um nó seguido por uma lista de nós adjacentes (conectados por uma aresta). "
            >
              ℹ️
            </span>
          </h2>
          <div className="connections-list">
            {Array.from(adjacencyList.entries()).map(
              ([nodeID, adjacencies]) => (
                <div key={nodeID} className="connection-item">
                  <span className="node-label">{nodeID}</span>
                  <span className="arrow">→</span>
                  <span className="connection-nodes">
                    {adjacencies.length > 0
                      ? adjacencies.join(", ")
                      : "(sem conexões)"}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <h2>
            <span>Directional Adjacency List</span>
            <span
              className="info-icon"
              title="Representação de adjacência direcional do grafo. Cada linha mostra um nó seguido por uma lista de nós adjacentes (conectados por uma aresta, em que a direção é importante). "
            >
              ℹ️
            </span>
          </h2>
          <div className="connections-list">
            {Array.from(directionalAdjacencyList.entries()).map(
              ([nodeID, adjacencies]) => (
                <div key={nodeID} className="connection-item">
                  <span className="node-label">{nodeID}</span>
                  <span className="arrow">→</span>
                  <span className="connection-nodes">
                    {adjacencies.length > 0
                      ? adjacencies.join(", ")
                      : "(sem conexões)"}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <h2>
            <span>Ciclos</span>
            <span
              className="info-icon"
              title="Um grafo possui um ciclo se existe um caminho que começa e termina no mesmo nó, passando por pelo menos um outro nó no meio. Ciclos podem indicar dependências circulares ou loops infinitos em um grafo de tarefas, por exemplo."
            >
              ℹ️
            </span>
          </h2>
          {cycles.length === 0 ? (
            <p>O grafo não contém ciclos.</p>
          ) : (
            <div className="cycles-list">
              {cycles.map((cycle, i) => (
                <div key={i} className="cycle-item">
                  <span className="cycle-index">#{i + 1}</span>
                  <span className="cycle-path">{cycle.join(" → ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2>
            <span>Grau dos nós</span>
            <span
              className="info-icon"
              title="Representa a quantidade de conexões de entrada e saída de cada nó. O grau de entrada é o número de arestas que chegam a um nó, enquanto o grau de saída é o número de arestas que saem de um nó. Esta informação é útil para entender a importância ou centralidade de um nó dentro do grafo."
            >
              ℹ️
            </span>
          </h2>
          <div className="degree-list">
            {graph.nodes().map((node) => {
              const inDegree = graph.inDegree(node);
              const outDegree = graph.outDegree(node);
              return (
                <div className="degree-item">
                  <span className="degree-node-label">{node}</span>
                  <span className="arrow">→</span>
                  <span className="d-in">
                    d<sub>in</sub> {inDegree}{" "}
                  </span>
                  <span className="d-out">
                    d<sub>out</sub> {outDegree}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="paths-list">
          <h2>Caminhos</h2>
          {findAllPaths(graph).map((path, i) => (
            <div key={i} className="path-item">
              <span className="path-index">#{i + 1}</span>
              <span className="path"> {path.join(" → ")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
