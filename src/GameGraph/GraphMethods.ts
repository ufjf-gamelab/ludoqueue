import Graph from "graphology";
import type { GameType, GraphType } from "../types";
import type {
  EntityMergerType,
  EntitySplitterType,
  EntityTransportType,
} from "../entities/EntitiesTypes";


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
