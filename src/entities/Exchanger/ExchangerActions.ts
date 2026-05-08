import type { GameType } from "../../GameTypes";
import { updatePassiveEntitiesConnections } from "../EntitiesConnections";
import {
  type DirectionType,
  type EntityExchangerType,
  type GoodType,
  type RecipeType,
} from "../EntitiesTypes";
import { clearConnectionsToEntity } from "../EntityCommonActions";

export type GameActionCreateExchanger = {
  type: "create exchanger";
  x: number;
  y: number;
  direction: DirectionType;
  input: [GoodType, number][];
  output: [GoodType, number][];
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

export type GameActionExchangerChangeRecipeInput = {
  type: "change recipe input";
  id: string;
  goodType: GoodType;
  quantity: number;
};

export type GameActionExchangerChangeRecipeOutput = {
  type: "change recipe output";
  id: string;
  goodType: GoodType;
  quantity: number;
};

export type GameActionExchangerChangeRecipe = {
  type: "change exchanger entire recipe";
  id: string;
  recipe: RecipeType;
};

export function createExchanger(
  state: GameType,
  x: number,
  y: number,
  direction: DirectionType,
  input: [GoodType, number][],
  output: [GoodType, number][],
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
  const newRecipe = {
    input,
    output,
  } as RecipeType;
  const newExchangerEntity: EntityExchangerType = {
    id: newExchangerID,
    name: "Exchanger " + numberID,
    type: "exchanger",
    recipe: newRecipe,
    direction,
    source: null,
    target: null,
    x,
    y,
    movingGoods: [],
    inputGoods: [],
    outputGoods: [],
  };
  newState.entities.set(newExchangerID, newExchangerEntity);
  newState.exchangers.push(newExchangerID);
  updatePassiveEntitiesConnections(newState, newExchangerEntity);
  return newState;
}

export function deleteExchanger(state: GameType, exchanger: string) {
  const exchangerIndex = state.exchangers.indexOf(exchanger);
  if (exchangerIndex !== -1) {
    const newState = structuredClone(state);
    const exchangerEntity = newState.entities.get(
      newState.exchangers[exchangerIndex],
    );
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
  updatePassiveEntitiesConnections(newState, newEntity);
  return newState;
}

export function changeRecipeInput(
  state: GameType,
  exchangerID: string,
  goodType: GoodType,
  quantity: number,
) {
  const newState = structuredClone(state);
  const exchangerEntity = newState.entities.get(exchangerID) as
    | EntityExchangerType
    | undefined;
  if (!exchangerEntity) {
    return state;
  }
  for (const i in exchangerEntity.recipe.input) {
    if (exchangerEntity.recipe.input[i][0] === goodType) {
      if (quantity <= 0) {
        exchangerEntity.recipe.input[i][1] = 0;
        return newState;
      }
      exchangerEntity.recipe.input[i][1] = quantity;
      return newState;
    }
  }
  return state;
}

export function changeRecipeOutput(
  state: GameType,
  exchangerID: string,
  goodType: GoodType,
  quantity: number,
) {
  const newState = structuredClone(state);
  const exchangerEntity = newState.entities.get(exchangerID) as
    | EntityExchangerType
    | undefined;
  if (!exchangerEntity) {
    return state;
  }
  for (const i in exchangerEntity.recipe.output) {
    if (exchangerEntity.recipe.output[i][0] === goodType) {
      if (quantity <= 0) {
        exchangerEntity.recipe.output[i][1] = 0;
        return newState;
      }
      exchangerEntity.recipe.output[i][1] = quantity;
      return newState;
    }
  }
  return state;
}

export function changeRecipeEntirely(
  state: GameType,
  exchangerID: string,
  recipe: RecipeType,
) {
  const newState = structuredClone(state);
  const exchangerEntity = newState.entities.get(exchangerID) as
    | EntityExchangerType
    | undefined;
  if (!exchangerEntity) {
    return state;
  }
  exchangerEntity.recipe = recipe;
  return newState;
}
