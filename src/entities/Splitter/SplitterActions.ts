import type { GameType } from "../../types";
import { functionsToConnectSource } from "../EntitiesConnections";
import { getInvertedDirection, type DirectionType, type EntitySplitterType } from "../EntitiesTypes";
import {
  clearConnectionsToEntity,
  getNeighbor,
  getOtherDirections,
} from "../EntityCommonActions";

export type GameActionCreateSplitter = {
  type: "create splitter";
  rate: number;
  max: number;
  x: number;
  y: number;
  entryDirection: DirectionType;
};

export type GameActionDeleteSplitter = {
  type: "delete splitter";
  id: string;
};

export type GameActionChangeSplitterEntryDirection = {
  type: "change splitter entry direction";
  id: string;
  direction: DirectionType;
};

export function createSplitter(
  state: GameType,
  max: number,
  rate: number,
  x: number,
  y: number,
  entryDirection: DirectionType,
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y,
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  //determina ID do splitter
  let numberID: number = 1;
  if (state.splitters.length > 0) {
    const lastSplitterNumber = state.splitters
      .map((splitterId) => parseInt(splitterId.replace("splitter", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastSplitterNumber + 1;
  }

  const newState = structuredClone(state);
  const newSplitterID: string = "splitter" + numberID;
  const newSplitterEntity: EntitySplitterType = {
    id: newSplitterID,
    name: "Splitter " + numberID,
    type: "splitter",
    max: max,
    rate: rate,
    cooldown: 1,
    source: null,
    targets: [],
    x,
    y,
    entryDirection,
    movingGoods: [],
    nextTargetIndex: 0,
    goods: [],
  };
  newState.entities.set(newSplitterID, newSplitterEntity);
  newState.splitters.push(newSplitterID);
  updateSplitterConnections(newState, newSplitterEntity);
  return newState;
}

export function deleteSplitter(state: GameType, splitter: string) {
  const splitterIndex = state.splitters.indexOf(splitter); //pelo createSplitter ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (splitterIndex !== -1) {
    const newState = structuredClone(state);
    const splitterEntity = newState.entities.get(
      newState.splitters[splitterIndex],
    );
    clearConnectionsToEntity(newState, splitterEntity!);
    newState.splitters.splice(splitterIndex);
    newState.entities.delete(splitter);
    return newState;
  }
  return state;
}

export function changeSplitterEntryDirection(
  state: GameType,
  splitterID: string,
  direction: DirectionType,
) {
  const splitterEntity = state.entities.get(splitterID);
  if (splitterEntity && splitterEntity.type === "splitter") {
    const newState = structuredClone(state);
    const newSplitterEntity = newState.entities.get(
      splitterID,
    ) as EntitySplitterType;
    newSplitterEntity.entryDirection = direction;
    updateSplitterConnections(newState, newSplitterEntity);
    return newState;
  }
  return state;
}


function updateSplitterConnections(state: GameType, splitter: EntitySplitterType) {
  splitter.source = null;
  splitter.targets = [];
  clearConnectionsToEntity(state, splitter);

  const sourceEntity = getNeighbor(state, splitter, splitter.entryDirection);
  if (sourceEntity && sourceEntity.type !== "consumer") {
    functionsToConnectSource[sourceEntity.type]?.(sourceEntity, splitter);
  }

  const otherDirs = getOtherDirections(splitter.entryDirection);

  for (const dir in otherDirs) {
    const direction = dir as DirectionType;
    const targetEntity = getNeighbor(state, splitter, direction);
    const invDirection = getInvertedDirection(direction);

    if (!targetEntity) continue;

    const isPointingToSplitter =
      (targetEntity.type === "consumer" &&
        targetEntity.entryDirection === direction) ||
      (targetEntity.type === "merger" &&
        targetEntity.leavingDirection !== splitter.entryDirection) ||
      (targetEntity.type === "stock" &&
        targetEntity.direction === direction) ||
      (targetEntity.type === "transport" &&
        targetEntity.entryDirection === direction);

    if (isPointingToSplitter) {
      if (targetEntity.type ==="transport" || targetEntity.type === "merger"){
        targetEntity.target=splitter.id;
      }
      splitter.targets.push(targetEntity.id);
    } else if (
      targetEntity.type === "merger" &&
      targetEntity.leavingDirection !== splitter.entryDirection
    ) {
      if (!targetEntity.sources.includes(splitter.id)) {
        targetEntity.sources.push(splitter.id);
      }
      splitter.targets.push(targetEntity.id);
    }
  }
}
