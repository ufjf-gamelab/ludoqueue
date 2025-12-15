import type { GameType } from "../../types";
import type { DirectionType, EntityStockType } from "../EntitiesTypes";


export type GameActionCreateStock = {
  type: "create stock";
  max: number;
  val: number;
  x: number;
  y: number;
  direction: DirectionType;
};

export type GameActionDeleteStock = {
  type: "delete stock";
  id: string;
};

export type GameActionChangeStockDirection = {
  type: "change stock direction";
  id: string;
  direction: DirectionType;
};

export function createStock(state: GameType, max: number, x: number, y:number, direction: DirectionType) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  let numberID: number = 1;
  if (state.stocks.length > 0) {
    const lastStockNumber = state.stocks
      .map((stockId) => parseInt(stockId.replace("stock", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastStockNumber + 1;
  }

  const newState = structuredClone(state);
  const newStockID: string = "stock" + numberID;
  const newStockEntity: EntityStockType = {
    id: newStockID,
    name: "Stock " + numberID,
    type: "stock",
    val: 0,
    max: max,
    closed: false,
    direction,
    x,
    y,
  };
  newState.entities.set(newStockID, newStockEntity);
  newState.stocks.push(newStockID);
  updateStockConnections(newState, newStockEntity);  
  return newState;
}

export function deleteStock(state: GameType, stock: string) {
  const stockIndex = state.stocks.indexOf(stock); //pelo createStock ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (stockIndex !== -1) {
    const newState = structuredClone(state);
    newState.stocks.splice(stockIndex);
    newState.entities.delete(stock);
    return newState;
  }
  return state;
}

export function changeStockDirection(state: GameType, entityId: string, direction: DirectionType) {
  const entity = state.entities.get(entityId) as EntityStockType;
  if (!entity || entity.type !== "stock") {
    return state;
  }
  if (entity.direction === direction) {
    return state;
  }
  const newState = structuredClone(state);
  const newEntity = newState.entities.get(entityId) as EntityStockType;
  newEntity.direction = direction;
  updateStockConnections(newState, newEntity);
  return newState;
}


function updateStockConnections(state: GameType, stock: EntityStockType) {
  switch (stock.direction) {
    case "up": {
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y - 1
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y + 1
      );
      if (upperEntity && upperEntity.type === "transport" && upperEntity.direction === "up") {
        upperEntity.source = stock.id;
      };
      if (lowerEntity && lowerEntity.type === "transport" && lowerEntity.direction === "up") {
        lowerEntity.target = stock.id;
      };
      break;
    }
    case "down":{
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y - 1
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y + 1
      );
      if (upperEntity && upperEntity.type === "transport" && upperEntity.direction === "down") {
        upperEntity.target = stock.id;
      };
      if (lowerEntity && lowerEntity.type === "transport" && lowerEntity.direction === "down") {
        lowerEntity.source = stock.id;
      };
      break;
    }
    case "left":
      break;
    case "right":
      break;
  }
}
