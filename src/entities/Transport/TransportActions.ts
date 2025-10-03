import type { GameType } from "../../types";
import type { EntityTransportType } from "../EntitiesTypes";

export type TransportDirection = "up" | "down" | "left" | "right";

export type GameActionCreateTransport = {
  type: "create transport";
  rate: number;
  max: number;
  source: string;
  target: string;
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
  source: string,
  target: string,
  x: number,
  y: number,
  direction: TransportDirection
) {
  if (!(state.entities.has(source) && state.entities.has(target))) {
    // chhecagem se origem e destino existem
    return state;
  }
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
