import type { GameType } from "../../types";
import { updatePassiveEntitiesConnections } from "../EntitiesConnections";
import type { DirectionType, EntityConsumerType } from "../EntitiesTypes";
import {
  clearConnectionsToEntity,
} from "../EntityCreationActions";

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
  updatePassiveEntitiesConnections(newState, newConsumerEntity);
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
  updatePassiveEntitiesConnections(newState, newConsumerEntity);
  return newState;
}
