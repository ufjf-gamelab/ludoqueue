//actions that are common for creating/deleting different entities

import type { GameType } from "../types";
import {
  type DirectionType,
  type EntityType,
} from "./EntitiesTypes";

export function getEntityAt(state: GameType, x: number, y: number) {
  const entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === x && entity.y === y,
  );
  return entity ? entity : null;
}

export function getNeighbor(
  state: GameType,
  entity: EntityType,
  direction: DirectionType,
) {
  switch (direction) {
    case "up":
      return getEntityAt(state, entity.x, entity.y - 1);
    case "down":
      return getEntityAt(state, entity.x, entity.y + 1);
    case "left":
      return getEntityAt(state, entity.x - 1, entity.y);
    case "right":
      return getEntityAt(state, entity.x + 1, entity.y);
  }
}

export function getOtherDirections(dir: DirectionType): DirectionType[] {
  switch (dir) {
    case "up": return ["down", "left", "right"];
    case "down": return ["up", "left", "right"];
    case "left": return ["up", "down", "right"];
    case "right": return ["up", "down", "left"];
  }
}

export function clearConnectionsToEntity(state: GameType, entity: EntityType) {
  if (entity.type !== "consumer") {
    clearEntitySource(state, entity.id);
  }
  if (entity.type !== "source") {
    clearEntityTarget(state, entity.id);
  }
}

function clearEntitySource(state: GameType, sourceId: string) {
  Array.from(state.entities.values()).forEach((entity) => {
    if (
      (entity.type === "transport" || entity.type === "splitter") &&
      entity.source === sourceId
    ) {
      entity.source = null;
    }

    if (entity.type === "merger") {
      const index = entity.sources.indexOf(sourceId);
      if (index !== -1) {
        entity.sources.splice(index);
      }
    }
  });
}

function clearEntityTarget(state: GameType, targetId: string) {
  Array.from(state.entities.values()).forEach((entity) => {
    if (entity.type === "transport" && entity.target === targetId) {
      entity.target = null;
    }

    if (entity.type === "splitter") {
      const index = entity.targets.indexOf(targetId);
      if (index !== -1) {
        entity.targets.splice(index);
      }
    }

    if (entity.type === "merger" && entity.target === targetId) {
      entity.target = null;
    }
  });
}
