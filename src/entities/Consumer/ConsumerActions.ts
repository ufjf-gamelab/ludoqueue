import type { GameType } from "../../types";
import type {
  DirectionType,
  EntityConsumerType,
  EntityTransportType,
} from "../EntitiesTypes";

export type GameActionCreateConsumer = {
  type: "create consumer";
  max: number;
  rate: number;
  x: number;
  y: number;
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
  y: number
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y
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
    val: 0,
    max: max,
    rate: rate,
    cooldown: 1,
    x: x,
    y: y,
    entryDirection: "left",
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
  direction: DirectionType
) {
  const consumerEntity = state.entities.get(consumerID) as EntityConsumerType | undefined;
  if (!consumerEntity || direction === consumerEntity.entryDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newConsumerEntity = newState.entities.get(
    consumerID
  ) as EntityConsumerType;
  newConsumerEntity.entryDirection = direction;
  updateConsumerConnections(newState, newConsumerEntity);
  return newState;
}

function updateConsumerConnections(
  state: GameType,
  consumer: EntityConsumerType
) {
  //primeiro limpar as conexoes antigas
  const oldTransportTarget = Array.from(state.entities.values()).find(
    (entity) => entity.type === "transport" && entity.target === consumer.id
  ) as EntityTransportType | undefined;
  if (oldTransportTarget) {
    oldTransportTarget.target = null;
  }

  switch (consumer.entryDirection) {
    case "up": {
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x && entity.y === consumer.y - 1
      );
      if (
        upperEntity &&
        upperEntity.type === "transport" &&
        upperEntity.direction === "down"
      ) {
        upperEntity.target = consumer.id;
      }
      break;
    }
    case "down": {
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x && entity.y === consumer.y + 1
      );
      if (
        lowerEntity &&
        lowerEntity.type === "transport" &&
        lowerEntity.direction === "up"
      ) {
        lowerEntity.target = consumer.id;
      }
      break;
    }
    case "left": {
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x - 1 && entity.y === consumer.y
      );
      if (
        leftEntity &&
        leftEntity.type === "transport" &&
        leftEntity.direction === "right"
      ) {
        leftEntity.target = consumer.id;
      }
      break;
    }
    case "right": {
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === consumer.x + 1 && entity.y === consumer.y
      );
      if (
        rightEntity &&
        rightEntity.type === "transport" &&
        rightEntity.direction === "left"
      ) {
        rightEntity.target = consumer.id;
      }
      break;
    }
  }
}
