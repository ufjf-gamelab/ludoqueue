import type { GameType } from "../../types";
import type {
  DirectionType,
  EntityConsumerType,
  EntitySplitterType,
  EntityTransportType,
} from "../EntitiesTypes";

export type GameActionCreateConsumer = {
  type: "create consumer";
  max: number;
  rate: number;
  x: number;
  y: number;
  entryDirection: DirectionType;
};

export type GameActionDeleteConsumer = {
  type: "delete consumer";
  id: string;
};

export type GameActionChangeConsumerEntryDirection = {
  type: "change consumer entry direction";
  id: string;
  direction: DirectionType;
};

export function createConsumer(
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
  let numberID: number = 1;
  if (state.consumers.length > 0) {
    const lastConsumerNumber = state.consumers
      .map((consumerId) => parseInt(consumerId.replace("consumer", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastConsumerNumber + 1;
  }

  const newState = structuredClone(state);
  const newConsumerID: string = "consumer" + numberID;
  const newConsumerEntity: EntityConsumerType = {
    id: newConsumerID,
    name: "Consumer " + numberID,
    type: "consumer",
    max: max,
    rate: rate,
    cooldown: 1,
    x,
    y,
    entryDirection,
    goods: [],
  };
  newState.entities.set(newConsumerID, newConsumerEntity);
  newState.consumers.push(newConsumerID);
  updateConsumerConnections(newState, newConsumerEntity);
  return newState;
}

export function deleteConsumer(state: GameType, consumer: string) {
  const consumerIndex = state.consumers.indexOf(consumer); //pelo createConsumer ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (consumerIndex !== -1) {
    const newState = structuredClone(state);
    newState.consumers.splice(consumerIndex);
    newState.entities.delete(consumer);
    return newState;
  }
  return state;
}

export function changeConsumerEntryDirection(
  state: GameType,
  consumerID: string,
  direction: DirectionType,
) {
  const consumerEntity = state.entities.get(consumerID) as
    | EntityConsumerType
    | undefined;
  if (!consumerEntity || direction === consumerEntity.entryDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newConsumerEntity = newState.entities.get(
    consumerID,
  ) as EntityConsumerType;
  newConsumerEntity.entryDirection = direction;
  updateConsumerConnections(newState, newConsumerEntity);
  return newState;
}

function updateConsumerConnections(
  state: GameType,
  consumer: EntityConsumerType,
) {
  //primeiro limpar as conexoes antigas
  const oldTransportTarget = Array.from(state.entities.values()).find(
    (entity) => entity.type === "transport" && entity.target === consumer.id,
  ) as EntityTransportType | undefined;
  const oldSplitterTarget = Array.from(state.entities.values()).find(
    (entity) =>
      entity.type === "splitter" && entity.target.includes(consumer.id),
  ) as EntitySplitterType | undefined;
  if (oldSplitterTarget) {
    const targetIndex = oldSplitterTarget.target.indexOf(consumer.id);
    if (targetIndex !== -1) {
      oldSplitterTarget.target[targetIndex] = null;
    }
  }
  if (oldTransportTarget) {
    oldTransportTarget.target = null;
  }

  switch (consumer.entryDirection) {
    case "up": {
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x && entity.y === consumer.y - 1,
      );
      if (upperEntity) {
        if (
          upperEntity.type === "transport" &&
          upperEntity.leavingDirection === "down"
        ) {
          upperEntity.target = consumer.id;
        }
        if (
          upperEntity.type === "splitter" &&
          upperEntity.entryDirection !== "down"
        ) {
          switch (upperEntity.entryDirection) {
            case "right":
              upperEntity.target[0] = consumer.id;
              break;
            case "up":
              upperEntity.target[1] = consumer.id;
              break;
            case "left":
              upperEntity.target[2] = consumer.id;
              break;
          }
        }
        if (upperEntity.type === "merger" && upperEntity.leavingDirection === "down"){
          upperEntity.target = consumer.id;
      }}
      break;
    }
    case "down": {
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x && entity.y === consumer.y + 1,
      );
      if (lowerEntity) {
        if (
          lowerEntity.type === "transport" &&
          lowerEntity.leavingDirection === "up"
        ) {
          lowerEntity.target = consumer.id;
        }
        if (
          lowerEntity.type === "splitter" &&
          lowerEntity.entryDirection !== "up"
        ) {
          switch (lowerEntity.entryDirection) {
            case "left":
              lowerEntity.target[0] = consumer.id;
              break;
            case "down":
              lowerEntity.target[1] = consumer.id;
              break;
            case "right":
              lowerEntity.target[2] = consumer.id;
              break;
          }
      }
        if (lowerEntity.type === "merger" && lowerEntity.leavingDirection === "up"){
          lowerEntity.target = consumer.id;}
    }
  }
      break;
    case "left": {
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x - 1 && entity.y === consumer.y,
      );
      if (leftEntity) {
        if (
          leftEntity.type === "transport" &&
          leftEntity.leavingDirection === "right"
        ) {
          leftEntity.target = consumer.id;
        }
        if (
          leftEntity.type === "splitter" &&
          leftEntity.entryDirection !== "right"
        ) {
          switch (leftEntity.entryDirection) {
            case "up":
              leftEntity.target[0] = consumer.id;
              break;
            case "left":
              leftEntity.target[1] = consumer.id;
              break;
            case "down":
              leftEntity.target[2] = consumer.id;
              break;
          }
        }
        if(leftEntity.type === "merger" && leftEntity.leavingDirection === "right"){
          leftEntity.target = consumer.id;
        }
      }
      break;
    }
    case "right": {
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x + 1 && entity.y === consumer.y,
      );
      if (rightEntity) {
        if (
          rightEntity.type === "transport" &&
          rightEntity.leavingDirection === "left"
        ) {
          rightEntity.target = consumer.id;
        }
        if (
          rightEntity.type === "splitter" &&
          rightEntity.entryDirection !== "left"
        ) {
          switch (rightEntity.entryDirection) {
            case "down":
              rightEntity.target[0] = consumer.id;
              break;
            case "right":
              rightEntity.target[1] = consumer.id;
              break;
            case "up":
              rightEntity.target[2] = consumer.id;
              break;
          }
        }
        if(rightEntity.type === "merger" && rightEntity.leavingDirection === "left"){
          rightEntity.target = consumer.id;
        }
      }
      break;
    }
  }
}
