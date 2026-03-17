import type { GameType } from "../types";
import type { DirectionType, EntityType } from "./EntitiesTypes";

export function getEntityAt(state: GameType, x: number, y: number) {
  const entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === x && entity.y === y,
  );
  return entity ? entity : null;
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
      const index = entity.source.indexOf(sourceId);
      if (index !== -1) {
        entity.source[index] = null;
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
      const index = entity.target.indexOf(targetId);
      if (index !== -1) {
        entity.target[index] = null;
      }
    }

    if (entity.type === "merger" && entity.target === targetId) {
      entity.target = null;
    }
  });
}

export function tryToConnectSource(
  entity: EntityType | null,
  expectedEntry: DirectionType,
  sourceID: string,
) {
  if (!entity) return;

  if (
    (entity.type === "transport" || entity.type === "splitter") &&
    entity.entryDirection === expectedEntry
  ) {
    entity.source = sourceID;
  }
}

export function tryToConnectTarget(
  entity: EntityType | null,
  expectedLeaving: DirectionType,
  targetID: string,
) {
  if (!entity) return;

  if (
    (entity.type === "transport" || entity.type === "merger") &&
    entity.leavingDirection === expectedLeaving
  ) {
    entity.target = targetID;
  }
}
