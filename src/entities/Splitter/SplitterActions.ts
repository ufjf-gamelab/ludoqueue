import type { GameType } from "../../types";
import type { DirectionType, EntitySplitterType } from "../EntitiesTypes";

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
    val: 0,
    max: max,
    rate: rate,
    cooldown: 1,
    source: null,
    target: null,
    x,
    y,
    entryDirection,
    movingGoods: [],
    lastTargetIndex: 0,
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

export function updateSplitterConnections(
  state: GameType,
  splitter: EntitySplitterType,
) {
  splitter.source = null;
  splitter.target = null;
  switch (splitter.entryDirection) {
    case "up": {
      updateSplitterUpperEntry(state, splitter);
      break;
    }
    case "down": {
      //updateSplitterDownEntry(state, splitter);
      break;
    }
    case "left": {
      //updateSplitterLeftEntry(state, splitter);
      break;
    }
    case "right": {
      //updateSplitterRightEntry(state, splitter);
      break;
    }
    default: {
      break;
    }
  }
}

function updateSplitterUpperEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  let sourceID =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y - 1,
    )?.id ?? null;
  let sourceEntity = sourceID ? state.entities.get(sourceID) : null;
  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "down") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "down") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "down") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection !== "up") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }
  if (sourceID) {
    splitter.source = sourceID;
  }
  if (
    sourceEntity &&
    sourceEntity.type === "transport" &&
    sourceEntity.leavingDirection === "down"
  ) {
    const transportEntity = sourceEntity;
    transportEntity.target = splitter.id;
  }
  //achar targets
  let target0 = Array.from(state.entities.values()).find(
    (entity) => entity.x === splitter.x + 1 && entity.y === splitter.y, //direita
  )?.id ?? null;
  let target0Entity = target0 ? state.entities.get(target0) : null;
  if (
    target0Entity &&
    ((target0Entity.type === "transport" &&
      target0Entity.entryDirection !== "left") ||
      (target0Entity.type === "stock" && target0Entity.direction !== "right") ||
      (target0Entity.type === "consumer" &&
        target0Entity.entryDirection !== "left") ||
      (target0Entity.type === "splitter" &&
        target0Entity.entryDirection !== "left") ||
      (target0Entity.type === "source"))
  ) {
    target0Entity = null;
    target0 = null;
  }
  if (target0Entity && target0Entity.type === "transport") {
    const transportEntity = target0Entity;
    transportEntity.source = splitter.id;
  }
  let target1 = Array.from(state.entities.values()).find(
    (entity) => entity.x === splitter.x && entity.y === splitter.y + 1, //baixo
  )?.id?? null;
  let target1Entity = target1 ? state.entities.get(target1) : null;
  if (
    target1Entity &&
    ((target1Entity.type === "transport" &&
      target1Entity.entryDirection !== "up") ||
      (target1Entity.type === "stock" && target1Entity.direction !== "down") ||
      (target1Entity.type === "consumer" &&
        target1Entity.entryDirection !== "up") ||
      (target1Entity.type === "splitter" &&
        target1Entity.entryDirection !== "up") ||
      (target1Entity.type === "source"))
  ) {
    target1Entity = null;
    target1 = null;
  }
  if (target1Entity && target1Entity.type === "transport") {
    const transportEntity = target1Entity;
    transportEntity.source = splitter.id;
  }
  let target2 = Array.from(state.entities.values()).find(
    (entity) => entity.x === splitter.x - 1 && entity.y === splitter.y, //esquerda
  )?.id?? null;
  let target2Entity = target2 ? state.entities.get(target2) : null;
  if (
    target2Entity &&
    ((target2Entity.type === "transport" &&
      target2Entity.entryDirection !== "right") ||
      (target2Entity.type === "stock" && target2Entity.direction !== "left") ||
      (target2Entity.type === "consumer" &&
        target2Entity.entryDirection !== "right") ||
      (target2Entity.type === "splitter" &&
        target2Entity.entryDirection !== "right") ||
      (target2Entity.type === "source"))
  ) {
    target2Entity = null;
    target2 = null;
  }
  if (target2Entity && target2Entity.type === "transport") {
    const transportEntity = target2Entity;
    transportEntity.source = splitter.id;
  }
  if (target0) {
    splitter.target = [target0];
  }
  if (target1) {
    splitter.target = [...(splitter.target || []), target1];
  }
  if (target2) {
    splitter.target = [...(splitter.target || []), target2];
  }
}
