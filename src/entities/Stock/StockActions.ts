import type { GameType } from "../../types";
import type { DirectionType, EntityStockType, EntityTransportType } from "../EntitiesTypes";


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

export function changeStockDirection(state: GameType, stockID: string, direction: DirectionType) {
  const stockEntity = state.entities.get(stockID) as EntityStockType | undefined;
  if (!stockEntity || stockEntity.direction === direction) {
    return state;
  }
  const newState = structuredClone(state);
  const newEntity = newState.entities.get(stockID) as EntityStockType;
  newEntity.direction = direction;
  const oldTransportSource = Array.from(newState.entities.values()).find(
    (entity) => entity.type === "transport" && entity.source === newEntity.id
  ) as EntityTransportType | undefined;
  if (oldTransportSource) {
    oldTransportSource.source = null;
  }
  const oldTransportTarget = Array.from(newState.entities.values()).find(
    (entity) => entity.type === "transport" && entity.target === newEntity.id
  ) as EntityTransportType | undefined;
  if (oldTransportTarget) {
    oldTransportTarget.target = null;
  };
  updateStockConnections(newState, newEntity);
  return newState;
}


function updateStockConnections(state: GameType, stock: EntityStockType) {
  //depois criar as novas conexoes
  switch (stock.direction) {
    case "up": {
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y - 1
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y + 1
      );
      if (upperEntity && upperEntity.type === "transport" && upperEntity.entryDirection === "down") {
        upperEntity.source = stock.id;
      };
      if (lowerEntity && lowerEntity.type === "transport" && lowerEntity.leavingDirection === "up") {
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
      if (upperEntity && upperEntity.type === "transport" && upperEntity.leavingDirection === "down") {
        upperEntity.target = stock.id;
      };
      if (lowerEntity && lowerEntity.type === "transport" && lowerEntity.entryDirection === "up") {
        lowerEntity.source = stock.id;
      };
      break;
    }
    case "left":{
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x - 1 && entity.y === stock.y
      );
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x + 1 && entity.y === stock.y
      );
      if (leftEntity && leftEntity.type === "transport" && leftEntity.entryDirection === "right") {
        leftEntity.source = stock.id;
      };
      if (rightEntity && rightEntity.type === "transport" && rightEntity.leavingDirection === "left") {
        rightEntity.target = stock.id;
      };
      break;
    }
    case "right":{
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x - 1 && entity.y === stock.y
      );
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x + 1 && entity.y === stock.y
      );
      if (leftEntity && leftEntity.type === "transport" && leftEntity.leavingDirection === "right") {
        leftEntity.target = stock.id;
      };
      if (rightEntity && rightEntity.type === "transport" && rightEntity.entryDirection === "left") {
        rightEntity.source = stock.id;
      };
      break;
    }
  }
}
