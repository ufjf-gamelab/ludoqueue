import type { GameType } from "../../types";
import { type EntityTransportType, type DirectionType, getInvertedDirection, type EntitySplitterType } from "../EntitiesTypes";
import { clearConnectionsToEntity, getEntityAt, getNeighbor } from "../EntityActions";
import { updateMergerArray } from "../Merger/MergerActions";

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
    const transportEntity = newState.entities.get(newState.transports[transportIndex]);
    clearConnectionsToEntity(newState,transportEntity!);
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
  clearConnectionsToEntity(state,transport);


  const newSource = getNeighbor(state,transport,transport.entryDirection);
  const newTarget = getNeighbor(state,transport, transport.leavingDirection);

  if (newSource && newSource.type !== "consumer"){
    if (newSource.type === "stock" && newSource.direction === getInvertedDirection(transport.entryDirection)){
      transport.source = newSource.id;
    }
    if ((newSource.type === "transport" || newSource.type === "source")&& newSource.leavingDirection === getInvertedDirection(transport.entryDirection)){
      transport.source = newSource.id;
      if (newSource.type === "transport"){
        newSource.target = transport.id;
      }
    }
    //ver esse debaixo
    if (newSource.type === "splitter" && newSource.entryDirection !== getInvertedDirection(transport.entryDirection)){
      newSource.targets.push(transport.id);
    }
  }
  switch (transport.entryDirection) {
    case "up": {
      const upperEntity = getEntityAt(state, transport.x, transport.y - 1);

      if (upperEntity && upperEntity.type !== "consumer") {
        if (upperEntity.type === "stock" && upperEntity.direction === "down") {
          transport.source = upperEntity.id;
        }

        if (
          (upperEntity.type === "transport" || upperEntity.type === "source") &&
          upperEntity.leavingDirection === "down"
        ) {
          if (upperEntity.type === "transport") {
            upperEntity.target = transport.id;
          }

          transport.source = upperEntity.id;
        }

        if (
          upperEntity.type === "splitter" &&
          upperEntity.entryDirection !== "down"
        ) {
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

    case "down": {
      const lowerEntity = getEntityAt(state, transport.x, transport.y + 1);

      if (lowerEntity && lowerEntity.type !== "consumer") {
        if (lowerEntity.type === "stock" && lowerEntity.direction === "up") {
          transport.source = lowerEntity.id;
        }

        if (
          (lowerEntity.type === "transport" || lowerEntity.type === "source") &&
          lowerEntity.leavingDirection === "up"
        ) {
          if (lowerEntity.type === "transport") {
            lowerEntity.target = transport.id;
          }

          transport.source = lowerEntity.id;
        }

        if (
          lowerEntity.type === "splitter" &&
          lowerEntity.entryDirection !== "up"
        ) {
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

    case "left": {
      const leftEntity = getEntityAt(state, transport.x - 1, transport.y);

      if (leftEntity && leftEntity.type !== "consumer") {
        if (leftEntity.type === "stock" && leftEntity.direction === "right") {
          transport.source = leftEntity.id;
        }

        if (
          (leftEntity.type === "transport" || leftEntity.type === "source") &&
          leftEntity.leavingDirection === "right"
        ) {
          if (leftEntity.type === "transport") {
            leftEntity.target = transport.id;
          }

          transport.source = leftEntity.id;
        }

        if (
          leftEntity.type === "splitter" &&
          leftEntity.entryDirection !== "right"
        ) {
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
      const rightEntity = getEntityAt(state, transport.x + 1, transport.y);

      if (rightEntity && rightEntity.type !== "consumer") {
        if (rightEntity.type === "stock" && rightEntity.direction === "left") {
          transport.source = rightEntity.id;
        }

        if (
          (rightEntity.type === "transport" || rightEntity.type === "source") &&
          rightEntity.leavingDirection === "left"
        ) {
          if (rightEntity.type === "transport") {
            rightEntity.target = transport.id;
          }

          transport.source = rightEntity.id;
        }

        if (
          rightEntity.type === "splitter" &&
          rightEntity.entryDirection !== "left"
        ) {
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

  switch (transport.leavingDirection) {
    case "up": {
      const upperEntity = getEntityAt(state, transport.x, transport.y - 1);

      if (upperEntity && upperEntity.type !== "source") {
        if (upperEntity.type === "stock" && upperEntity.direction === "up") {
          transport.target = upperEntity.id;
        }

        if (
          (upperEntity.type === "transport" ||
            upperEntity.type === "consumer") &&
          upperEntity.entryDirection === "down"
        ) {
          if (upperEntity.type === "transport") {
            upperEntity.source = transport.id;
          }

          transport.target = upperEntity.id;
        }

        if (
          upperEntity.type === "splitter" &&
          upperEntity.entryDirection === "down"
        ) {
          transport.target = upperEntity.id;
          upperEntity.source = transport.id;
        }
      }

      break;
    }

    case "down": {
      const lowerEntity = getEntityAt(state, transport.x, transport.y + 1);

      if (lowerEntity && lowerEntity.type !== "source") {
        if (lowerEntity.type === "stock" && lowerEntity.direction === "down") {
          transport.target = lowerEntity.id;
        }

        if (
          (lowerEntity.type === "transport" ||
            lowerEntity.type === "consumer") &&
          lowerEntity.entryDirection === "up"
        ) {
          if (lowerEntity.type === "transport") {
            lowerEntity.source = transport.id;
          }

          transport.target = lowerEntity.id;
        }

        if (
          lowerEntity.type === "splitter" &&
          lowerEntity.entryDirection === "up"
        ) {
          transport.target = lowerEntity.id;
          lowerEntity.source = transport.id;
        }
      }

      break;
    }

    case "left": {
      const leftEntity = getEntityAt(state, transport.x - 1, transport.y);

      if (leftEntity && leftEntity.type !== "source") {
        if (leftEntity.type === "stock" && leftEntity.direction === "left") {
          transport.target = leftEntity.id;
        }

        if (
          (leftEntity.type === "transport" || leftEntity.type === "consumer") &&
          leftEntity.entryDirection === "right"
        ) {
          if (leftEntity.type === "transport") {
            leftEntity.source = transport.id;
          }

          transport.target = leftEntity.id;
        }

        if (
          leftEntity.type === "splitter" &&
          leftEntity.entryDirection === "right"
        ) {
          transport.target = leftEntity.id;
          leftEntity.source = transport.id;
        }
      }

      break;
    }

    case "right": {
      const rightEntity = getEntityAt(state, transport.x + 1, transport.y);

      if (rightEntity && rightEntity.type !== "source") {
        if (rightEntity.type === "stock" && rightEntity.direction === "right") {
          transport.target = rightEntity.id;
        }

        if (
          (rightEntity.type === "transport" ||
            rightEntity.type === "consumer") &&
          rightEntity.entryDirection === "left"
        ) {
          if (rightEntity.type === "transport") {
            rightEntity.source = transport.id;
          }

          transport.target = rightEntity.id;
        }

        if (
          rightEntity.type === "splitter" &&
          rightEntity.entryDirection === "left"
        ) {
          transport.target = rightEntity.id;
          rightEntity.source = transport.id;
        }
      }

      break;
    }
  }
}
