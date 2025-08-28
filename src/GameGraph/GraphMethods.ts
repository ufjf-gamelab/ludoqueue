import type { GameType, GraphType, LinkType } from "../types";

export function convertGameToGraph(game: GameType): GraphType {
  const graph: GraphType = {
    nodes: [],
    links: [],
  };

  game.entities.forEach((node) => {
    graph.nodes.push({ id: node.id, name: node.name, val: 0 });
    if (node.type === "transport") {
      const linkToTransport: LinkType = {
        source: node.source,
        target: node.id,
      };
      const linkFromTransport: LinkType = {
        source: node.id,
        target: node.target,
      };
      graph.links.push(linkToTransport);
      graph.links.push(linkFromTransport);
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
