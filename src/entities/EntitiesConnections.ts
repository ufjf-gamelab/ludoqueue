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
  if (source.type === "transport" || source.type === "merger" || (source.type === "exchanger" && target.type === "stock")) {
    source.target = target.id;
  } else if (source.type === "splitter") {
    if (!source.targets.includes(target.id)) source.targets.push(target.id);
  }

  if (target.type === "transport" || target.type === "splitter"|| (target.type === "exchanger" && source.type === "stock")) {
    target.source = source.id;
  } else if (target.type === "merger") {
    if (!target.sources.includes(source.id)) target.sources.push(source.id);
  }
}

//usada com novos sources, verifica se entity pode enviar item na output
export function canOutputTo(
  entryNeighbor: EntityType,
  outputDirection: DirectionType,
  entityThatCalled: EntityType,
) {
  if (entryNeighbor.type === "exchanger" && entityThatCalled.type === "stock") {
    return entryNeighbor.direction === outputDirection;
   }
  else if (
    entryNeighbor.type === "source" ||
    entryNeighbor.type === "transport" ||
    entryNeighbor.type === "merger"
  ) {
    return entryNeighbor.leavingDirection === outputDirection;
  } else if (entryNeighbor.type === "stock") {
    return entryNeighbor.direction === outputDirection;
  } else if (entryNeighbor.type === "splitter") {
    return entryNeighbor.entryDirection !== outputDirection;
  } else {
    return false;
  }
}

//usada com novos targets, verifica se entity pode receber item na direcao de input
export function canReceiveFrom(
  leavingNeighbor: EntityType,
  inputDirection: DirectionType,
  entityThatCalled: EntityType,
) {
  const invDirection = getInvertedDirection(inputDirection);

  if (leavingNeighbor.type === "exchanger" && entityThatCalled.type === "stock") {
    return leavingNeighbor.direction === inputDirection;
   }
  else if (
    leavingNeighbor.type === "consumer" ||
    leavingNeighbor.type === "transport" ||
    leavingNeighbor.type === "splitter"
  ) {
    return leavingNeighbor.entryDirection === invDirection;
  } else if (leavingNeighbor.type === "stock") {
    return leavingNeighbor.direction === invDirection;
  } else if (leavingNeighbor.type === "merger") {
    return leavingNeighbor.leavingDirection !== invDirection;
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
      canOutputTo(entryNeighbor, getInvertedDirection(entryDir), entity)
    ) {
      linkEntities(entryNeighbor, entity);
    }
  }
  if (leavingDir) {
    const leavingNeighbor = getNeighbor(state, entity, leavingDir);
    if (leavingNeighbor && canReceiveFrom(leavingNeighbor, leavingDir, entity)) {
      linkEntities(entity, leavingNeighbor);
    }
  }
}
