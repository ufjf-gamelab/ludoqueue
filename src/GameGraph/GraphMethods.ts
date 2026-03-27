import type { GameType, GraphType, LinkType } from "../types";

export function convertGameToGraph(game: GameType): GraphType {
  const graph: GraphType = {
    nodes: [],
    links: [],
  };

  game.entities.forEach((node) => {
    graph.nodes.push({ id: node.id, name: node.name, val: 0 });
    if ((node.type === "transport" || node.type ==="splitter") && node.source) {
      const linkToTransport: LinkType = {
        source: node.source,
        target: node.id,
      };
      graph.links.push(linkToTransport);
    }
    if ((node.type === "transport" || node.type ==="merger")&& node.target){
      const linkFromTransport: LinkType = {
        source: node.id,
        target: node.target,
      };
      graph.links.push(linkFromTransport);
    }
    if (node.type === "splitter" && node.targets.length>0){
      for (const targetIndice in node.targets){
        const linkFromSplitter: LinkType = {
          source: node.id,
          target: node.targets[targetIndice],
        }
        graph.links.push(linkFromSplitter);
      }
    }

    if (node.type === "merger" && node.sources.length>0){
      for (const sourceIndice in node.sources){
        const linktoMerger: LinkType = {
          source: node.sources[sourceIndice],
          target: node.id,
        }
        graph.links.push(linktoMerger)
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
