import type { GameType } from "../../types";
import type { DirectionType, EntitySourceType, EntityTransportType } from "../EntitiesTypes";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  val: number;
  x: number;
  y: number;
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

export function createSource(state: GameType, max: number, x: number, y:number) {
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
    x: x,
    y: y,
    leavingDirection: "right",
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

function updateSourceConnections(state: GameType, sourceID: EntitySourceType) {
  //primeiro limpar as conexoes antigas
    const oldTransportSource = Array.from(state.entities.values()).find(
      (entity) => entity.type === "transport" && entity.source === sourceID.id
    ) as EntityTransportType | undefined;
    if (oldTransportSource) {
      oldTransportSource.source = null;
    }
  //depois criar as novas conexoes
  switch (sourceID.leavingDirection) {
    case "up":{
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === sourceID.x && entity.y === sourceID.y - 1
      );
      if (upperEntity && upperEntity.type === "transport" && upperEntity.direction === "up") {
        upperEntity.source=sourceID.id;
      }
      break;
    }
    case "down":{
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === sourceID.x && entity.y === sourceID.y + 1
      );
      if (lowerEntity && lowerEntity.type === "transport" && lowerEntity.direction === "down") {
        lowerEntity.source=sourceID.id;
      };
      break;
    }
    case "left":{
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === sourceID.x - 1 && entity.y === sourceID.y
      );
      if (leftEntity && leftEntity.type === "transport" && leftEntity.direction === "left") {
        leftEntity.source=sourceID.id;
      };
      break;
    }
    case "right":{
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === sourceID.x + 1 && entity.y === sourceID.y
      );
      if (rightEntity && rightEntity.type === "transport" && rightEntity.direction === "right") {
        rightEntity.source=sourceID.id;
      };
      break;
    }
  }
}
