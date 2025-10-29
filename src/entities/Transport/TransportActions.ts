import type { GameType } from "../../types";
import type { EntityTransportType, EntityType } from "../EntitiesTypes";

export type TransportDirection = "up" | "down" | "left" | "right";

export type GameActionCreateTransport = {
  type: "create transport";
  rate: number;
  max: number;
  source: string | undefined;
  target: string | undefined;
  x: number;
  y: number;
  direction: TransportDirection;
};

export type GameActionDeleteTransport = {
  type: "delete transport";
  id: string;
};

export function createTransport(
  state: GameType,
  max: number,
  rate: number,
  source: string | undefined,
  target: string | undefined,
  x: number,
  y: number,
  direction: TransportDirection
) {
  //if (!(state.entities.has(source) && state.entities.has(target))) {
  //  // chhecagem se origem e destino existem
  //  return state;
  //}
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
    source: source,
    target: target,
    x,
    y,
    direction,
  };
  newState.entities.set(newTransportID, newTransportEntity);
  newState.transports.push(newTransportID);
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

export function updateTransporters(state: GameType, entity: EntityType) {
  updateLeftTransporter(state, entity);
  updateRightTransporter(state, entity);
  updateUpperTransporter(state, entity);
  updateLowerTransporter(state, entity);
}
function updateLeftTransporter(state: GameType, entity: EntityType) {
  const entityToUpdate = Array.from(state.entities.values()).find(
    (e) => e.x + 1 === entity.x && e.y === entity.y && e.type === "transport"
  ) as EntityTransportType | undefined;
  if (entityToUpdate) {
    switch (entityToUpdate.direction) {
      case "left": {
        entityToUpdate.source = entity.id;
        break;
      }
      case "right": {
        entityToUpdate.target = entity.id;
        break;
      }
    }
  }
}
function updateRightTransporter(state: GameType, entity: EntityType) {
  const entityToUpdate = Array.from(state.entities.values()).find(
    (e) => e.x - 1 === entity.x && e.y === entity.y && e.type === "transport"
  ) as EntityTransportType | undefined;
  if (!entityToUpdate) {
    return;
  }
  switch (entityToUpdate.direction) {
    case "left": {
      entityToUpdate.target = entity.id;
      break;
    }
    case "right": {
      entityToUpdate.source = entity.id;
      break;
    }
  }
}
function updateUpperTransporter(state: GameType, entity: EntityType) {
  const entityToUpdate = Array.from(state.entities.values()).find(
    (e) => e.x === entity.x && e.y + 1 === entity.y && e.type === "transport"
  ) as EntityTransportType | undefined;
  if (!entityToUpdate) {
    return;
  }
  switch (entityToUpdate.direction) {
    case "up": {
      entityToUpdate.source = entity.id;
      break;
    }
    case "down": {
      entityToUpdate.target = entity.id;
      break;
    }
  }
}
function updateLowerTransporter(state: GameType, entity: EntityType) {
  const entityToUpdate = Array.from(state.entities.values()).find(
    (e) =>
      e.x === entity.x && e.y - 1 === entity.y && e.type === "transport"
  ) as EntityTransportType | undefined;
  if (!entityToUpdate) {
    return;
  }
  switch (entityToUpdate.direction) {
    case "up": {
      entityToUpdate.target = entity.id;
      break;
    }
    case "down": {
      entityToUpdate.source = entity.id;
      break;
    }
  }
}
