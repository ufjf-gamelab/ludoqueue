import type { GameType } from "../../types";
import { updatePassiveEntitiesConnections } from "../EntitiesConnections";
import type {
  DirectionType,
  EntitySourceType,
  GoodType,
} from "../EntitiesTypes";
import {
  clearConnectionsToEntity,
} from "../EntityCreationActions";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  x: number;
  y: number;
  goodType: GoodType;
  leavingDirection: DirectionType;
};

export type GameActionDeleteSource = {
  type: "delete source";
  id: string;
};

export type GameActionChangeSourceLeavingDirection = {
  type: "change source leaving direction";
  id: string;
  direction: DirectionType;
};

export type GameActionChangeSourceGoodType = {
  type: "change source good type";
  id: string;
  goodType: GoodType;
};

export function createSource(
  state: GameType,
  max: number,
  x: number,
  y: number,
  leavingDirection: DirectionType,
  goodType: GoodType,
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y,
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  let numberID: number = 1;
  if (state.sources.length > 0) {
    const lastSourceNumber = state.sources
      .map((sourceId) => parseInt(sourceId.replace("source", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastSourceNumber + 1;
  }

  const newState = structuredClone(state);
  const newSourceID: string = "source" + numberID;
  const newSourceEntity: EntitySourceType = {
    id: newSourceID,
    name: "Source " + numberID,
    type: "source",
    max: max,
    cooldown: 1,
    rate: 1,
    x,
    y,
    leavingDirection,
    goodType,
    goods: [],
  };
  newState.entities.set(newSourceID, newSourceEntity);
  newState.sources.push(newSourceID);
  updatePassiveEntitiesConnections(newState, newSourceEntity);
  return newState;
}

export function deleteSource(state: GameType, source: string) {
  const sourceIndex = state.sources.indexOf(source); //pelo createSource ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (sourceIndex !== -1) {
    const newState = structuredClone(state);
    const sourceEntity = newState.entities.get(newState.sources[sourceIndex]);
    clearConnectionsToEntity(newState, sourceEntity!);
    newState.sources.splice(sourceIndex);
    newState.entities.delete(source);
    return newState;
  }
  return state;
}

export function changeSourceLeavingDirection(
  state: GameType,
  sourceID: string,
  direction: DirectionType,
) {
  const sourceEntity = state.entities.get(sourceID) as
    | EntitySourceType
    | undefined;
  if (!sourceEntity || direction === sourceEntity.leavingDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newSourceEntity = newState.entities.get(sourceID) as EntitySourceType;
  newSourceEntity.leavingDirection = direction;
  updatePassiveEntitiesConnections(newState, newSourceEntity);
  return newState;
}

export function changeSourceGoodType(
  state: GameType,
  sourceID: string,
  goodType: GoodType,
) {
  const sourceEntity = state.entities.get(sourceID) as
    | EntitySourceType
    | undefined;
  if (!sourceEntity || goodType === sourceEntity.goodType) {
    return state;
  }
  const newState = structuredClone(state);
  const newSourceEntity = newState.entities.get(sourceID) as EntitySourceType;
  newSourceEntity.goodType = goodType;
  return newState;
}
