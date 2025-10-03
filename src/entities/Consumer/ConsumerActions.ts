import type { GameType } from "../../types";
import type { EntityConsumerType } from "../EntitiesTypes";

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

export function createConsumer(state: GameType, max: number, rate: number, x:number, y:number) {
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
  };
  newState.entities.set(newConsumerID, newConsumerEntity);
  newState.consumers.push(newConsumerID);
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
