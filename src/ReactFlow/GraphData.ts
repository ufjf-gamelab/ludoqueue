import type { Edge, Node } from "@xyflow/react";
import type { GameType } from "../types";
import type {
  EntityMergerType,
  EntitySplitterType,
  EntityTransportType,
} from "../entities/EntitiesTypes";

export function getInitialNodes(state: GameType): Node[] {
  const nodes: Node[] = [];
  Array.from(state.entities.values()).map((node) => {
    if (node.type !== "transport") {
      nodes.push({
        id: node.id,
        type: node.type,
        position: { x: node.x * 200, y: node.y * 200 },
        data: { label: node.name, entity: node },
      });
    }
  });
  return nodes;
}

export function getInitialEdges(state: GameType): Edge[] {
  const edges: Edge[] = [];
  state.transports.forEach((transport) => {
    const entity = state.entities.get(transport) as EntityTransportType;
    if (entity.source && entity.target) {
      edges.push({
        id: `${entity.source} "-" ${entity.target}`,
        source: entity.source,
        target: entity.target,
        type: "animatedSvg",
      });
    }
  });
  state.mergers.forEach((merger) => {
    const entity = state.entities.get(merger) as EntityMergerType;
    if (entity.sources) {
      for (const source of entity.sources) {
        edges.push({
          id: `${source} "-" ${entity.id}`,
          source: source,
          target: entity.id,
          type: "animatedSvg",
        });
      }
    }
    if (entity.target) {
      edges.push({
        id: `${entity.id} "-" ${entity.target}`,
        source: entity.id,
        target: entity.target,
        type: "animatedSvg",
      });
    }
  });
  state.splitters.forEach((splitter) => {
    const entity = state.entities.get(splitter) as EntitySplitterType;
    if (entity.targets) {
      for (const target of entity.targets) {
        edges.push({
          id: `${entity.id} "-" ${target}`,
          source: entity.id,
          target: target,
          type: "animatedSvg",
        });
      }
      if (entity.source) {
        edges.push({
          id: `${entity.source} "-" ${entity.id}`,
          source: entity.source,
          target: entity.id,
          type: "animatedSvg",
        });
      }
    }
  });
  return edges;
}
