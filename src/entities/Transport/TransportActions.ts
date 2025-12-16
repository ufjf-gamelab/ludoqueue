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
  direction: DirectionType;
};

export type GameActionDeleteTransport = {
  type: "delete transport";
  id: string;
};

export function createTransport(
  state: GameType,
  max: number,
  rate: number,
  x: number,
  y: number,
  direction: DirectionType
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
    direction,
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

  switch (transport.direction) {
    case "up":{
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y - 1
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y + 1
      );
      if (lowerEntity && lowerEntity.type !== "consumer"){
        if ((lowerEntity.type === "transport" || lowerEntity.type === "stock") && lowerEntity.direction === "up") {
          transport.source = lowerEntity.id;
        }
        if (lowerEntity.type === "source" && lowerEntity.leavingDirection === "up") {
          transport.source = lowerEntity.id;
        }
      }
      if (upperEntity && upperEntity.type !== "source"){
        if ((upperEntity.type === "transport" || upperEntity.type === "stock") && upperEntity.direction==="up"){
          transport.target=upperEntity.id;
        }
        if (upperEntity.type === "consumer" && upperEntity.entryDirection=== "down"){
          transport.target=upperEntity.id;
        }
      }
      break;
    }
    case "down":{
      
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y - 1
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === transport.x && entity.y === transport.y + 1
      );
      if (upperEntity && upperEntity.type !== "consumer"){
        if ((upperEntity.type === "transport" || upperEntity.type === "stock") && upperEntity.direction === "down") {
          transport.source = upperEntity.id;
        }
        if (upperEntity.type === "source" && upperEntity.leavingDirection === "down") {
          transport.source = upperEntity.id;
        }
      }
      if (lowerEntity && lowerEntity.type !== "source"){
        if ((lowerEntity.type === "transport" || lowerEntity.type === "stock") && lowerEntity.direction==="down"){
          transport.target=lowerEntity.id;
        }
        if (lowerEntity.type === "consumer" && lowerEntity.entryDirection=== "up"){
          transport.target=lowerEntity.id;
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
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x + 1 &&
          entity.y === transport.y
      );
      if (rightEntity && rightEntity.type !== "consumer"){
        if ((rightEntity.type === "transport" || rightEntity.type === "stock") && rightEntity.direction==="left"){
          transport.source = rightEntity.id;
        }
        if (rightEntity.type === "source" && rightEntity.leavingDirection === "left") {
          transport.source = rightEntity.id;
        }
      }
      if (leftEntity && leftEntity.type !== "source"){
        if ((leftEntity.type === "transport" || leftEntity.type === "stock") && leftEntity.direction==="left"){
          transport.target=leftEntity.id;
        }
        if (leftEntity.type === "consumer" && leftEntity.entryDirection=== "right"){
          transport.target=leftEntity.id;
        }
      }
      break;
    }
       
    case "right": {
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x - 1 &&
          entity.y === transport.y
      );
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) =>
          entity.x === transport.x + 1 &&
          entity.y === transport.y
      );
      if (leftEntity && leftEntity.type !== "consumer"){
        if ((leftEntity.type === "transport" || leftEntity.type === "stock") && leftEntity.direction === "right") {
          transport.source = leftEntity.id;
        }
        if (leftEntity.type === "source" && leftEntity.leavingDirection === "right") {
          transport.source = leftEntity.id;
        }
      }
      if (rightEntity && rightEntity.type !== "source"){
        if ((rightEntity.type === "transport" || rightEntity.type === "stock") && rightEntity.direction === "right") {
          transport.target = rightEntity.id;
        }
        if (rightEntity.type === "consumer" && rightEntity.entryDirection === "left") {
          transport.target = rightEntity.id;
        }
      }
      break;
    }
  }
}
