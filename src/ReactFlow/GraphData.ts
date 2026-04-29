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

export function resolveRealSource(
  state: GameType,
  startId: string | undefined,
): string | null {
  if (!startId) return null;

  let current = state.entities.get(startId);
  const visited = new Set<string>();

  while (current && current.type === "transport") {
    if (visited.has(current.id)) return null; // evita loop infinito
    visited.add(current.id);

    const transport = current as EntityTransportType;
    current = state.entities.get(transport.source!);
  }

  return current?.id ?? null;
}

export function resolveRealTarget(
  state: GameType,
  startId: string | undefined,
): string | null {
  if (!startId) return null;

  let current = state.entities.get(startId);
  const visited = new Set<string>();

  while (current && current.type === "transport") {
    if (visited.has(current.id)) return null;
    visited.add(current.id);

    const transport = current as EntityTransportType;
    current = state.entities.get(transport.target!);
  }

  return current?.id ?? null;
}

export function getInitialEdges(state: GameType): Edge[] {
  const edges: Edge[] = [];
  state.transports.forEach((transportId) => {
    const entity = state.entities.get(transportId);
    if (!entity || entity.type !== "transport") return;
    const transport = entity as EntityTransportType;
    const realSource = resolveRealSource(state, transport.source!);
    const realTarget = resolveRealTarget(state, transport.target!);
    if (!realSource || !realTarget) return;
    edges.push({
      id: `${realSource}-${realTarget}-${transport.id}`,
      source: realSource,
      target: realTarget,
      type: "animatedSvg",
    });
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
