import type { GameType } from "../../types";
import {
  functionsToConnectSource,
  functionsToConnectTarget,
} from "../EntitiesConnections";
import { type EntityTransportType, type DirectionType } from "../EntitiesTypes";
import { clearConnectionsToEntity, getNeighbor } from "../EntityCommonActions";

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
  leavingDirection: DirectionType,
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y,
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
    goods: [],
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
    const transportEntity = newState.entities.get(
      newState.transports[transportIndex],
    );
    clearConnectionsToEntity(newState, transportEntity!);
    newState.transports.splice(transportIndex);
    newState.entities.delete(transport);
    return newState;
  }
  return state;
}

export function changeTransportEntryDirection(
  state: GameType,
  transportID: string,
  direction: DirectionType,
) {
  const transportEntity = state.entities.get(transportID) as
    | EntityTransportType
    | undefined;
  if (
    !transportEntity ||
    direction === transportEntity.entryDirection ||
    direction === transportEntity.leavingDirection
  ) {
    return state;
  }
  const newState = structuredClone(state);
  const newTransportEntity = newState.entities.get(
    transportID,
  ) as EntityTransportType;
  newTransportEntity.entryDirection = direction;
  updateTransportConnections(newState, newTransportEntity);
  return newState;
}

export function changeTransportLeavingDirection(
  state: GameType,
  transportID: string,
  direction: DirectionType,
) {
  const transportEntity = state.entities.get(transportID) as
    | EntityTransportType
    | undefined;
  if (
    !transportEntity ||
    direction === transportEntity.leavingDirection ||
    direction === transportEntity.entryDirection
  ) {
    return state;
  }
  const newState = structuredClone(state);
  const newTransportEntity = newState.entities.get(
    transportID,
  ) as EntityTransportType;
  newTransportEntity.leavingDirection = direction;
  updateTransportConnections(newState, newTransportEntity);
  return newState;
}

function updateTransportConnections(
  state: GameType,
  transport: EntityTransportType,
) {
  transport.source = null;
  transport.target = null;
  clearConnectionsToEntity(state, transport);

  const newSource = getNeighbor(state, transport, transport.entryDirection);
  const newTarget = getNeighbor(state, transport, transport.leavingDirection);

  if (newSource && newSource.type !== "consumer") {
    functionsToConnectSource[newSource.type](newSource, transport);

    if (newTarget && newTarget.type !== "source") {
      functionsToConnectTarget[newTarget.type](newTarget, transport);
    }
  }
}
