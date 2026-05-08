import Graph from "graphology";
import type { GameType, GraphType } from "../GameTypes";
import type {
  EntityMergerType,
  EntitySplitterType,
  EntityTransportType,
} from "../entities/EntitiesTypes";
import { allSimplePaths } from "graphology-simple-path";

export function createAdjacencyList(graph: GraphType) {
  const adjacency = new Map<string, string[]>();

  graph.forEachNode((node) => {
    adjacency.set(node, graph.outNeighbors(node));
  });

  return adjacency;
}

export function convertGameToGraphology(state: GameType): GraphType {
  const graph = new Graph({ type: "directed", multi: true });

  addNodes(graph, state);
  addTransportEdges(graph, state);
  addMergerEdges(graph, state);
  addSplitterEdges(graph, state);

  return graph;
}

function addNodes(graph: Graph, state: GameType) {
  for (const entity of state.entities.values()) {
    graph.addNode(entity.id, {
      label: entity.name,
      type: entity.type,
      x: entity.x,
      y: entity.y,
      entity,
    });
  }
}

function addTransportEdges(graph: Graph, state: GameType) {
  state.transports.forEach((transportId) => {
    const entity = state.entities.get(transportId);
    const transport = entity as EntityTransportType;
    if (transport.source) {
      graph.addEdge(transport.source, transport.id, { kind: "transport-in" });
    }
    if (transport.target) {
      graph.addEdge(transport.id, transport.target, { kind: "transport-out" });
    }
  });
}

function addMergerEdges(graph: Graph, state: GameType) {
  state.mergers.forEach((mergerId) => {
    const entity = state.entities.get(mergerId) as EntityMergerType;

    if (entity.sources) {
      for (const source of entity.sources) {
        graph.addEdge(source, entity.id, { kind: "merger-in" });
      }
    }

    if (entity.target) {
      graph.addEdge(entity.id, entity.target, { kind: "merger-out" });
    }
  });
}

function addSplitterEdges(graph: Graph, state: GameType) {
  state.splitters.forEach((splitterId) => {
    const entity = state.entities.get(splitterId) as EntitySplitterType;

    if (entity.source) {
      graph.addEdge(entity.source, entity.id, { kind: "splitter-in" });
    }

    if (entity.targets) {
      for (const target of entity.targets) {
        graph.addEdge(entity.id, target, { kind: "splitter-out" });
      }
    }
  });
}

export function findAllCycles(graph: Graph) {
  const cycles: string[][] = [];
  const seen = new Set<string>();

  graph.forEachNode((node) => {
    const paths = allSimplePaths(graph, node, node, {
      maxDepth: graph.order, //acha caminhos simples de volta ao mesmo nó, limitando a profundidade para evitar loops infinitos
    });

    for (const path of paths) {
      if (path.length > 2) {
        const normalized = normalizeCycle(path);
        const key = normalized.join("->");
        if (!seen.has(key)) {
          seen.add(key);
          cycles.push(normalized);
        }
      }
    }
  });

  return cycles;
}

function normalizeCycle(cycle: string[]) {
  //ve se nao tem ciclo repetido, rotacionando o ciclo para uma forma canônica (começando pelo nó com menor id)
  const base = cycle.slice(0, -1);
  let minIndex = 0;
  for (let i = 1; i < base.length; i++) {
    if (base[i] < base[minIndex]) minIndex = i;
  }
  const rotated = [...base.slice(minIndex), ...base.slice(0, minIndex)];
  rotated.push(rotated[0]);
  return rotated;
}
