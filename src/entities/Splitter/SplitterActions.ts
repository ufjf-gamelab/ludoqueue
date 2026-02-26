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
      (entity) => entity.x === x && entity.y === y
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
  direction: DirectionType
) {
  const splitterEntity = state.entities.get(splitterID);
  if (splitterEntity && splitterEntity.type === "splitter") {
    const newState = structuredClone(state);
    const newSplitterEntity = newState.entities.get(splitterID) as EntitySplitterType;
    newSplitterEntity.entryDirection = direction;
    updateSplitterConnections(newState, newSplitterEntity);
    return newState;
  }
  return state;
}

export function updateSplitterConnections(
  state: GameType,
  splitter: EntitySplitterType
) {
  splitter.source = null;
  splitter.target = null;
  switch (splitter.entryDirection) {
    case "up":{
      const sourceID = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === splitter.x && entity.y === splitter.y - 1
      )?.id;
      if (sourceID){splitter.source = sourceID};
      const sourceEntity = sourceID ? state.entities.get(sourceID) : null;
      if (sourceEntity && sourceEntity.type === "transport") {
        const transportEntity = sourceEntity;
        transportEntity.target = splitter.id;
      }
      //achar targets 
      const target0 = Array.from(state.entities.values()).find(
        (entity) =>          entity.x === splitter.x + 1 && entity.y === splitter.y //direita
      )?.id;
      const target0Entity = target0 ? state.entities.get(target0) : null;
      if (target0Entity && target0Entity.type === "transport") {
        const transportEntity = target0Entity;
        transportEntity.source = splitter.id;
      }
      const target1 = Array.from(state.entities.values()).find(
        (entity) =>          entity.x === splitter.x && entity.y === splitter.y + 1 //baixo
      )?.id;
      const target1Entity = target1 ? state.entities.get(target1) : null;
      if (target1Entity && target1Entity.type === "transport") {
        const transportEntity = target1Entity;
        transportEntity.source = splitter.id;
      }
      const target2 = Array.from(state.entities.values()).find(
        (entity) =>          entity.x === splitter.x - 1 && entity.y === splitter.y //esquerda
      )?.id;
      const target2Entity = target2 ? state.entities.get(target2) : null;
      if (target2Entity && target2Entity.type === "transport") {
        const transportEntity = target2Entity;
        transportEntity.source = splitter.id;
      }
      if (target0){
        splitter.target = [target0];
      }
      if (target1){
        splitter.target = [...(splitter.target || []), target1];
      }
      if (target2){
        splitter.target = [...(splitter.target || []), target2];
      }
      
      break;
    }
  }
}
