import type { GameType } from "../../types";
import type { DirectionType, EntityConsumerType } from "../EntitiesTypes";
import { clearConnectionsToEntity, getEntityAt, tryToConnectTarget } from "../EntityActions";


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
    const consumerEntity = newState.entities.get(
      newState.consumers[consumerIndex],
    );
    clearConnectionsToEntity(newState, consumerEntity!);
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
  // limpar conexões antigas
  clearConnectionsToEntity(state, consumer);

  switch (consumer.entryDirection) {
    case "up": {
      const upperEntity = getEntityAt(state, consumer.x, consumer.y - 1);

      if (upperEntity) {
        tryToConnectTarget(upperEntity, "down", consumer.id);

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
      }

      break;
    }

    case "down": {
      const lowerEntity = getEntityAt(state, consumer.x, consumer.y + 1);

      if (lowerEntity) {
        tryToConnectTarget(lowerEntity, "up", consumer.id);

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
      }

      break;
    }

    case "left": {
      const leftEntity = getEntityAt(state, consumer.x - 1, consumer.y);

      if (leftEntity) {
        tryToConnectTarget(leftEntity, "right", consumer.id);

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
      }

      break;
    }

    case "right": {
      const rightEntity = getEntityAt(state, consumer.x + 1, consumer.y);

      if (rightEntity) {
        tryToConnectTarget(rightEntity, "left", consumer.id);

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
      }

      break;
    }
  }
}
