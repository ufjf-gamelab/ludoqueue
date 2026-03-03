import type { GameType } from "../../types";
import type { DirectionType, EntitySourceType, EntitySplitterType, EntityTransportType } from "../EntitiesTypes";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  x: number;
  y: number;
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

export function createSource(state: GameType, max: number, x: number, y:number, leavingDirection: DirectionType) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y
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
    val: 0,
    max: max,
    cooldown: 1,
    rate: 1,
    x,
    y,
    leavingDirection,
  };
  newState.entities.set(newSourceID, newSourceEntity);
  newState.sources.push(newSourceID);
  updateSourceConnections(newState, newSourceEntity);
  return newState;
}

export function deleteSource(state: GameType, source: string) {
  const sourceIndex = state.sources.indexOf(source); //pelo createSource ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (sourceIndex !== -1) {
    const newState = structuredClone(state);
    newState.sources.splice(sourceIndex);
    newState.entities.delete(source);
    return newState;
  }
  return state;
}

export function changeSourceLeavingDirection(state: GameType, sourceID: string, direction: DirectionType) {
  const sourceEntity = state.entities.get(sourceID) as EntitySourceType | undefined;
  if (!sourceEntity || direction === sourceEntity.leavingDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newSourceEntity = newState.entities.get(sourceID) as EntitySourceType;
  newSourceEntity.leavingDirection = direction;
  updateSourceConnections(newState, newSourceEntity);
  return newState;
}

function updateSourceConnections(state: GameType, source: EntitySourceType) {
  //primeiro limpar as conexoes antigas
    const oldSinkSource = Array.from(state.entities.values()).find(
      (entity) => (entity.type === "transport" || entity.type === "splitter") && entity.source === source.id
    ) as EntityTransportType | EntitySplitterType| undefined;
    if (oldSinkSource) {
      oldSinkSource.source = null;
    }
  //depois criar as novas conexoes
  switch (source.leavingDirection) {
    case "up":{
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === source.x && entity.y === source.y - 1
      );
      if (upperEntity){
        if (upperEntity.type === "transport" && upperEntity.entryDirection === "down") {
          upperEntity.source = source.id;
        };
        if (upperEntity.type === "splitter" && upperEntity.entryDirection === "down"){
          upperEntity.source = source.id;
        }
      };
      break;
    }
    case "down":{
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === source.x && entity.y === source.y + 1
      );
      if (lowerEntity){
        if(lowerEntity.type === "transport" && lowerEntity.entryDirection === "up") {
        lowerEntity.source = source.id;
      };
        if (lowerEntity.type === "splitter" && lowerEntity.entryDirection === "up"){
          lowerEntity.source = source.id;
        }
    };
      break;
    }
    case "left":{
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === source.x - 1 && entity.y === source.y
      );
      if (leftEntity){
        if(leftEntity.type === "transport" && leftEntity.entryDirection === "right") {
          leftEntity.source = source.id;
        };
        if (leftEntity.type === "splitter" && leftEntity.entryDirection === "right"){
          leftEntity.source = source.id;
        }
      };
      break;
    }
    case "right":{
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === source.x + 1 && entity.y === source.y
      );
      if (rightEntity){
        if(rightEntity.type === "transport" && rightEntity.entryDirection === "left") {
          rightEntity.source = source.id;
        };
        if (rightEntity.type === "splitter" && rightEntity.entryDirection === "left"){
          rightEntity.source = source.id;
        }
      }
      break;
    }
  }
}
