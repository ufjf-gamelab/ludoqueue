import type { GameType } from "../types";
import {
  getInvertedDirection,
  type DirectionType,
  type EntityConsumerType,
  type EntitySourceType,
  type EntityStockType,
  type EntityType,
} from "./EntitiesTypes";
import { clearConnectionsToEntity, getNeighbor } from "./EntityCommonActions";

//functions that are common for connections between different entities

export function linkEntities(source: EntityType, target: EntityType) {
  if (source.type === "transport" || source.type === "merger") {
    source.target = target.id;
  } else if (source.type === "splitter") {
    if (!source.targets.includes(target.id)) source.targets.push(target.id);
  }

  if (target.type === "transport" || target.type === "splitter") {
    target.source = source.id;
  } else if (target.type === "merger") {
    if (!target.sources.includes(source.id)) target.sources.push(source.id);
  }
}

//usada com novos sources, verifica se entity pode enviar item na output
export function canOutputTo(
  entity: EntityType,
  outputDirection: DirectionType,
) {
  if (
    entity.type === "source" ||
    entity.type === "transport" ||
    entity.type === "merger"
  ) {
    return entity.leavingDirection === outputDirection;
  } else if (entity.type === "stock") {
    return entity.direction === outputDirection;
  } else if (entity.type === "splitter") {
    return entity.entryDirection !== outputDirection;
  } else {
    return false;
  }
}

//usada com novos targets, verifica se entity pode receber item na direcao de input
export function canReceiveFrom(
  entity: EntityType,
  inputDirection: DirectionType,
) {
  const invDirection = getInvertedDirection(inputDirection);
  if (
    entity.type === "consumer" ||
    entity.type === "transport" ||
    entity.type === "splitter"
  ) {
    return entity.entryDirection === invDirection;
  } else if (entity.type === "stock") {
    return entity.direction === invDirection;
  } else if (entity.type === "merger") {
    return entity.leavingDirection !== invDirection;
  } else {
    return false;
  }
}

export function updatePassiveEntitiesConnections(
  state: GameType,
  entity: EntityStockType | EntitySourceType | EntityConsumerType,
) {
  clearConnectionsToEntity(state, entity);

  const entryDir =
    entity.type === "stock"
      ? getInvertedDirection(entity.direction)
      : entity.type === "consumer"
        ? entity.entryDirection
        : null;

  const leavingDir =
    entity.type === "stock"
      ? entity.direction
      : entity.type === "source"
        ? entity.leavingDirection
        : null;

  if (entryDir) {
    const entryNeighbor = getNeighbor(state, entity, entryDir);
    if (
      entryNeighbor &&
      canOutputTo(entryNeighbor, getInvertedDirection(entryDir))
    ) {
      linkEntities(entryNeighbor, entity);
    }
  }
  if (leavingDir) {
    const leavingNeighbor = getNeighbor(state, entity, leavingDir);
    if (leavingNeighbor && canReceiveFrom(leavingNeighbor, leavingDir)) {
      linkEntities(entity, leavingNeighbor);
    }
  }
}
