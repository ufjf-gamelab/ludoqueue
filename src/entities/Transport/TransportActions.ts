import type { GameType } from "../../types";
import type {
  EntityTransportType,
  DirectionType,
} from "../EntitiesTypes";

export type GameActionCreateTransport = {
  type: "create transport";
  rate: number;
  max: number;
  x: number;
  y: number;
  entryDirection: DirectionType;
  leavingDirection: DirectionType;
};

export type GameActionDeleteTransport = {
  type: "delete transport";
  id: string;
};

export type GameActionChangeTransportEntryDirection = {
  type: "change transport entry direction";
  id: string;
  direction: DirectionType;
};

export type GameActionChangeTransportLeavingDirection = {
  type: "change transport leaving direction";
  id: string;
  direction: DirectionType;
};

export function createTransport(
  state: GameType,
  max: number,
  rate: number,
  x: number,
  y: number,
  entryDirection: DirectionType,
  leavingDirection: DirectionType
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  //determina ID do transport
  let numberID: number = 1;
  if (state.transports.length > 0) {
    const lastTransportNumber = state.transports
      .map((transportId) => parseInt(transportId.replace("transport", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastTransportNumber + 1;
  }

  const newState = structuredClone(state);
  const newTransportID: string = "transport" + numberID;
  const newTransportEntity: EntityTransportType = {
    id: newTransportID,
    name: "Transport " + numberID,
    type: "transport",
    val: 0,
    max: max,
    rate: rate,
    cooldown: 1,
    source: null,
    target: null,
    x,
    y,
    entryDirection,
    leavingDirection,
    movingGoods: [],
  };
  newState.entities.set(newTransportID, newTransportEntity);
  newState.transports.push(newTransportID);
  updateTransportConnections(newState, newTransportEntity);
  return newState;
}

export function deleteTransport(state: GameType, transport: string) {
  const transportIndex = state.transports.indexOf(transport); //pelo createTransport ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (transportIndex !== -1) {
    const newState = structuredClone(state);
    newState.transports.splice(transportIndex);
    newState.entities.delete(transport);
    return newState;
  }
  return state;
}

export function changeTransportEntryDirection(state:GameType, transportID:string, direction:DirectionType){
  const transportEntity = state.entities.get(transportID) as EntityTransportType | undefined;
  if (!transportEntity || direction === transportEntity.entryDirection || direction === transportEntity.leavingDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newTransportEntity = newState.entities.get(transportID) as EntityTransportType;
  newTransportEntity.entryDirection = direction;
  updateTransportConnections(newState, newTransportEntity);
  return newState;
}

export function changeTransportLeavingDirection(state:GameType, transportID:string, direction:DirectionType){
  const transportEntity = state.entities.get(transportID) as EntityTransportType | undefined;
  if (!transportEntity || direction === transportEntity.leavingDirection || direction === transportEntity.entryDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newTransportEntity = newState.entities.get(transportID) as EntityTransportType;
  newTransportEntity.leavingDirection = direction;
  updateTransportConnections(newState, newTransportEntity);
  return newState;
}

function updateTransportConnections(
  state: GameType,
  transport: EntityTransportType
) {
  transport.source = null;
  transport.target = null;

  const oldTransportSource = Array.from(state.entities.values()).find(
    (entity) => entity.type === "transport" && entity.source === transport.id
  ) as EntityTransportType | undefined;
  if (oldTransportSource) {
    oldTransportSource.source = null;
  }
  const oldTransportTarget = Array.from(state.entities.values()).find(
    (entity) => entity.type === "transport" && entity.target === transport.id
  ) as EntityTransportType | undefined;
  if (oldTransportTarget) {
    oldTransportTarget.target = null;
  };

  switch (transport.entryDirection) {
    case "up":{
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y - 1
      );
      if (upperEntity && upperEntity.type !== "consumer"){
        if (upperEntity.type === "stock" && upperEntity.direction === "down") {
          transport.source = upperEntity.id;
        }
        if ((upperEntity.type === "transport" || upperEntity.type === "source") && upperEntity.leavingDirection === "down") {
          transport.source = upperEntity.id;
        }

        if ((upperEntity.type === "splitter") && upperEntity.entryDirection !== "down"){
          switch (upperEntity.entryDirection) {
            case "up":
              upperEntity.target[1] = transport.id;
              break;
            case "left":
              upperEntity.target[2] = transport.id;
              break;
            case "right":
              upperEntity.target[0] = transport.id;
              break;
          }
          transport.source = upperEntity.id;
        }
      }
      break;
    }
    case "down":{
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y + 1
      );
      if (lowerEntity && lowerEntity.type !== "consumer"){
        if (lowerEntity.type === "stock" && lowerEntity.direction === "up") {
          transport.source = lowerEntity.id;
        }
        if ((lowerEntity.type === "transport" || lowerEntity.type === "source") && lowerEntity.leavingDirection === "up") {
          transport.source = lowerEntity.id;
        }
        if ((lowerEntity.type === "splitter") && lowerEntity.entryDirection !== "up"){
          switch (lowerEntity.entryDirection) {
            case "down":
              lowerEntity.target[1] = transport.id;
              break;
            case "left":
              lowerEntity.target[0] = transport.id;
              break;
            case "right":
              lowerEntity.target[2] = transport.id;
              break;
          }
          transport.source = lowerEntity.id;
        }
      }
      break;
    }
    case "left":{
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x - 1 &&
          entity.y === transport.y
      );
      if (leftEntity && leftEntity.type !== "consumer"){
        if (leftEntity.type === "stock" && leftEntity.direction === "right") {
          transport.source = leftEntity.id;
        }
        if ((leftEntity.type === "transport" || leftEntity.type === "source") && leftEntity.leavingDirection === "right") {
          transport.source = leftEntity.id;
        }
        if ((leftEntity.type === "splitter") && leftEntity.entryDirection !== "right"){
          switch (leftEntity.entryDirection) {
            case "up":
              leftEntity.target[0] = transport.id;
              break;
            case "left":
              leftEntity.target[1] = transport.id;
              break;
            case "down":
              leftEntity.target[2] = transport.id;
              break;
          }
          transport.source = leftEntity.id;
        }
      }
      break;
    }
       
    case "right": {
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x + 1 &&
          entity.y === transport.y
      );
      if (rightEntity && rightEntity.type !== "consumer"){
        if (rightEntity.type === "stock" && rightEntity.direction === "left") {
          transport.source = rightEntity.id;
        }
        if ((rightEntity.type === "transport" || rightEntity.type === "source") && rightEntity.leavingDirection === "left") {
          transport.source = rightEntity.id;
        }
        if ((rightEntity.type === "splitter") && rightEntity.entryDirection !== "left"){
          switch (rightEntity.entryDirection) {
            case "down":
              rightEntity.target[0] = transport.id;
              break;
            case "right":
              rightEntity.target[1] = transport.id;
              break;
            case "up":
              rightEntity.target[2] = transport.id;
              break;
          }
          transport.source = rightEntity.id;
        }
      }
      break;
    }
  }
  switch (transport.leavingDirection){
    case "up":{
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y - 1
      );
      if (upperEntity && upperEntity.type !== "source"){
        if (upperEntity.type === "stock" && upperEntity.direction==="up"){
          transport.target=upperEntity.id;
        }
        if ((upperEntity.type === "transport" || upperEntity.type === "consumer") && upperEntity.entryDirection=== "down"){
          transport.target=upperEntity.id;
        }
        if ((upperEntity.type === "splitter") && upperEntity.entryDirection === "down"){
          upperEntity.source = transport.id;
        }
      }
      break;
    }
    case "down":{
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y + 1
      );
      if (lowerEntity && lowerEntity.type !== "source"){
        if (lowerEntity.type === "stock" && lowerEntity.direction==="down"){
          transport.target=lowerEntity.id;
        }
        if ((lowerEntity.type === "transport" || lowerEntity.type === "consumer") && lowerEntity.entryDirection=== "up"){
          transport.target=lowerEntity.id;
        }
        if ((lowerEntity.type === "splitter") && lowerEntity.entryDirection === "up"){
          lowerEntity.source = transport.id;
        }
      }
      break;
    }
    case "left":{
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x - 1 &&
          entity.y === transport.y
      );
      if (leftEntity && leftEntity.type !== "source"){
        if (leftEntity.type === "stock" && leftEntity.direction==="left"){
          transport.target=leftEntity.id;
        }
        if ((leftEntity.type === "transport" || leftEntity.type === "consumer") && leftEntity.entryDirection=== "right"){
          transport.target=leftEntity.id;
        }
        if ((leftEntity.type === "splitter") && leftEntity.entryDirection === "right"){
          leftEntity.source = transport.id;
        }
      }
      break;
    }
       
    case "right": {
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x + 1 &&
          entity.y === transport.y
      );
      if (rightEntity && rightEntity.type !== "source"){
        if (rightEntity.type === "stock" && rightEntity.direction==="right"){
          transport.target=rightEntity.id;
        }
        if ((rightEntity.type === "transport" || rightEntity.type === "consumer") && rightEntity.entryDirection=== "left"){
          transport.target=rightEntity.id;
        }
        if ((rightEntity.type === "splitter") && rightEntity.entryDirection === "left"){
          rightEntity.source = transport.id;
        }
      }
      break;
    }
  }
}
