import type { GameType } from "../../types";
import {
  getInvertedDirection,
  type DirectionType,
  type EntityExchangerType,
} from "../EntitiesTypes";
import { clearConnectionsToEntity, getNeighbor } from "../EntityCommonActions";
import { recipe1 } from "./recipes";

export type GameActionCreateExchanger = {
  type: "create exchanger";
  x: number;
  y: number;
  direction: DirectionType;
};

export type GameActionDeleteExchanger = {
  type: "delete exchanger";
  id: string;
};

export type GameActionChangeExchangerDirection = {
  type: "change exchanger direction";
  id: string;
  direction: DirectionType;
};

export function createExchanger(
  state: GameType,
  x: number,
  y: number,
  direction: DirectionType,
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
  if (state.exchangers.length > 0) {
    const lastExchangerNumber = state.exchangers
      .map((exchangerId) => parseInt(exchangerId.replace("exchanger", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastExchangerNumber + 1;
  }

  const newState = structuredClone(state);
  const newExchangerID: string = "exchanger" + numberID;
  const newExchangerEntity: EntityExchangerType = {
    id: newExchangerID,
    name: "Exchanger " + numberID,
    type: "exchanger",
    recipe: recipe1,
    direction,
    source: null,
    target: null,
    x,
    y,
    movingGoods: [],
  };
  newState.entities.set(newExchangerID, newExchangerEntity);
  newState.exchangers.push(newExchangerID);
  updateExchangerConnections(newState, newExchangerEntity);
  return newState;
}

export function deleteExchanger(state: GameType, exchanger: string) {
  const exchangerIndex = state.exchangers.indexOf(exchanger); 
  if (exchangerIndex !== -1) {
    const newState = structuredClone(state);
    const exchangerEntity = newState.entities.get(newState.exchangers[exchangerIndex]);
    clearConnectionsToEntity(newState, exchangerEntity!);
    newState.exchangers.splice(exchangerIndex);
    newState.entities.delete(exchanger);
    return newState;
  }
  return state;
}

export function changeExchangerDirection(
  state: GameType,
  exchangerID: string,
  direction: DirectionType,
) {
  const exchangerEntity = state.entities.get(exchangerID) as
    | EntityExchangerType
    | undefined;
  if (!exchangerEntity || exchangerEntity.direction === direction) {
    return state;
  }
  const newState = structuredClone(state);
  const newEntity = newState.entities.get(exchangerID) as EntityExchangerType;
  newEntity.direction = direction;
  clearConnectionsToEntity(newState, newEntity);
  updateExchangerConnections(newState, newEntity);
  return newState;
}

function updateExchangerConnections(
  state: GameType,
  exchangerEntity: EntityExchangerType,
) {
  exchangerEntity.source = null;
  exchangerEntity.target = null;
  const sourceEntity = getNeighbor(state, exchangerEntity, getInvertedDirection(exchangerEntity.direction));
  const targetEntity = getNeighbor(state, exchangerEntity, exchangerEntity.direction);
  if (sourceEntity && sourceEntity.type === "stock" && sourceEntity.direction === exchangerEntity.direction) {
    exchangerEntity.source = sourceEntity.id;
  }
  if (targetEntity && targetEntity.type === "stock" && targetEntity.direction === exchangerEntity.direction) {
    exchangerEntity.target = targetEntity.id;
  }
}
