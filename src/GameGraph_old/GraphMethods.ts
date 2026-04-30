import Graph from "graphology";
import type { GameType, GraphType, LinkType } from "../types";
import type {
  EntityMergerType,
  EntitySplitterType,
  EntityTransportType,
} from "../entities/EntitiesTypes";

export function convertGameToGraph(game: GameType): GraphType {
  const graph: GraphType = {
    nodes: [],
    links: [],
  };

  game.entities.forEach((node) => {
    graph.nodes.push({ id: node.id, name: node.name, val: 0 });
    if (
      (node.type === "transport" ||
        node.type === "splitter" ||
        node.type === "exchanger") &&
      node.source
    ) {
      const linkToTransport: LinkType = {
        source: node.source,
        target: node.id,
      };
      graph.links.push(linkToTransport);
    }
    if (
      (node.type === "transport" ||
        node.type === "merger" ||
        node.type === "exchanger") &&
      node.target
    ) {
      const linkFromTransport: LinkType = {
        source: node.id,
        target: node.target,
      };
      graph.links.push(linkFromTransport);
    }
    if (node.type === "splitter" && node.targets.length > 0) {
      for (const targetIndice in node.targets) {
        const linkFromSplitter: LinkType = {
          source: node.id,
          target: node.targets[targetIndice],
        };
        graph.links.push(linkFromSplitter);
      }
    }

    if (node.type === "merger" && node.sources.length > 0) {
      for (const sourceIndice in node.sources) {
        const linktoMerger: LinkType = {
          source: node.sources[sourceIndice],
          target: node.id,
        };
        graph.links.push(linktoMerger);
      }
    }
  });

  return graph;
}

export function createAdjacencyList(graphData: GraphType) {
  const adj: Map<string, string[]> = new Map();
  graphData.nodes.forEach((node) => {
    adj.set(node.id, []);
  });
  graphData.links.forEach(({ source, target }) => {
    if (!adj.get(source)) {
      adj.set(source, []);
    }
    if (!adj.get(target)) {
      adj.set(target, []);
    }
    const adjFrom = adj.get(source);
    if (!adjFrom?.includes(target)) {
      adjFrom?.push(target);
    }
  });
  return adj;
}

export function convertGameToGraphology(state: GameType) {
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
