import type { GameType } from "../../types";
import type {
  DirectionType,
  EntityStockType,
  EntityTransportType,
} from "../EntitiesTypes";

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

export function createStock(
  state: GameType,
  max: number,
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

export function changeStockDirection(
  state: GameType,
  stockID: string,
  direction: DirectionType,
) {
  const stockEntity = state.entities.get(stockID) as
    | EntityStockType
    | undefined;
  if (!stockEntity || stockEntity.direction === direction) {
    return state;
  }
  const newState = structuredClone(state);
  const newEntity = newState.entities.get(stockID) as EntityStockType;
  newEntity.direction = direction;
  const oldTransportSource = Array.from(newState.entities.values()).find(
    (entity) => entity.type === "transport" && entity.source === newEntity.id,
  ) as EntityTransportType | undefined;
  if (oldTransportSource) {
    oldTransportSource.source = null;
  }
  const oldTransportTarget = Array.from(newState.entities.values()).find(
    (entity) => entity.type === "transport" && entity.target === newEntity.id,
  ) as EntityTransportType | undefined;
  if (oldTransportTarget) {
    oldTransportTarget.target = null;
  }
  updateStockConnections(newState, newEntity);
  return newState;
}

function updateStockConnections(state: GameType, stock: EntityStockType) {
  //depois criar as novas conexoes
  switch (stock.direction) {
    case "up": {
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y - 1,
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y + 1,
      );
      if (upperEntity) {
        if (
          upperEntity.type === "transport" &&
          upperEntity.entryDirection === "down"
        ) {
          upperEntity.source = stock.id;
        }
        if (
          upperEntity.type === "splitter" &&
          upperEntity.entryDirection === "down"
        ) {
          upperEntity.source = stock.id;
        }
        if (upperEntity.type === "merger" && upperEntity.leavingDirection !== "down"){
          switch (upperEntity.leavingDirection){
            case "up":{
              upperEntity.source[1] = stock.id;
              break;
            }
            case "left":{
              upperEntity.source[2] = stock.id;
              break;
            }
            case "right":{
              upperEntity.source[0] = stock.id;
              break;
          }
        }
        }
      }
      if (lowerEntity) {
        if (
          lowerEntity.type === "transport" &&
          lowerEntity.leavingDirection === "up"
        ) {
          lowerEntity.target = stock.id;
        }
        if (
          lowerEntity.type === "splitter" &&
          lowerEntity.entryDirection !== "up"
        ) {
          switch (lowerEntity.entryDirection) {
            case "left":
              lowerEntity.target[0] = stock.id;
              break;
            case "down":
              lowerEntity.target[1] = stock.id;
              break;
            case "right":
              lowerEntity.target[2] = stock.id;
              break;
          }
        }
        if (lowerEntity.type === "merger" && lowerEntity.leavingDirection === "up"){
          lowerEntity.target = stock.id;}
      }
      break;
    }
    case "down": {
      const upperEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y - 1,
      );
      const lowerEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x && entity.y === stock.y + 1,
      );
      if (upperEntity) {
        if (
          upperEntity.type === "transport" &&
          upperEntity.leavingDirection === "down"
        ) {
          upperEntity.target = stock.id;
        }
        if (
          upperEntity.type === "splitter" &&
          upperEntity.entryDirection !== "down"
        ) {
          switch (upperEntity.entryDirection) {
            case "right":
              upperEntity.target[0] = stock.id;
              break;
            case "up":
              upperEntity.target[1] = stock.id;
              break;
            case "left":
              upperEntity.target[2] = stock.id;
              break;
          }
        }
        if (upperEntity.type === "merger" && upperEntity.leavingDirection === "down"){
          upperEntity.target = stock.id;}
      }
      if (lowerEntity) {
        if (
          lowerEntity.type === "transport" &&
          lowerEntity.entryDirection === "up"
        ) {
          lowerEntity.source = stock.id;
        }
        if (
          lowerEntity.type === "splitter" &&
          lowerEntity.entryDirection === "up"
        ) {
          lowerEntity.source = stock.id;
        }
        if (lowerEntity.type === "merger" && lowerEntity.leavingDirection !== "up"){
          switch (lowerEntity.leavingDirection){
            case "down":{
              lowerEntity.source[1] = stock.id;
              break;
            }
            case "left":{
              lowerEntity.source[0] = stock.id;
              break;
            }
            case "right":{
              lowerEntity.source[2] = stock.id;
              break;
          }
        }}
      }
      break;
    }
    case "left": {
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x - 1 && entity.y === stock.y,
      );
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x + 1 && entity.y === stock.y,
      );
      if (leftEntity) {
        if (
          leftEntity.type === "transport" &&
          leftEntity.entryDirection === "right"
        ) {
          leftEntity.source = stock.id;
        }
        if (
          leftEntity.type === "splitter" &&
          leftEntity.entryDirection === "right"
        ) {
          leftEntity.source = stock.id;
        }
        if (leftEntity.type === "merger" && leftEntity.leavingDirection !== "right"){
          switch (leftEntity.leavingDirection){
            case "up":{
              leftEntity.source[0] = stock.id;
              break;
            }
            case "down":{
              leftEntity.source[2] = stock.id;
              break;
            }
            case "left":{
              leftEntity.source[1] = stock.id;
              break;
          }
        }}
      }
      if (rightEntity) {
        if (
          rightEntity.type === "transport" &&
          rightEntity.leavingDirection === "left"
        ) {
          rightEntity.target = stock.id;
        }
        if (
          rightEntity.type === "splitter" &&
          rightEntity.entryDirection !== "left"
        ) {
          switch (rightEntity.entryDirection) {
            case "down":
              rightEntity.target[0] = stock.id;
              break;
            case "right":
              rightEntity.target[1] = stock.id;
              break;
            case "up":
              rightEntity.target[2] = stock.id;
              break;
          }
        }
        if (rightEntity.type === "merger" && rightEntity.leavingDirection === "left"){
          rightEntity.target = stock.id;}
      }
      break;
    }
    case "right": {
      const leftEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x - 1 && entity.y === stock.y,
      );
      const rightEntity = Array.from(state.entities.values()).find(
        (entity) => entity.x === stock.x + 1 && entity.y === stock.y,
      );
      if (leftEntity) {
        if (
          leftEntity.type === "transport" &&
          leftEntity.leavingDirection === "right"
        ) {
          leftEntity.target = stock.id;
        }
        if (
          leftEntity.type === "splitter" &&
          leftEntity.entryDirection !== "right"
        ) {
          switch (leftEntity.entryDirection) {
            case "up":
              leftEntity.target[0] = stock.id;
              break;
            case "left":
              leftEntity.target[1] = stock.id;
              break;
            case "down":
              leftEntity.target[2] = stock.id;
              break;
          }
        }
        if (leftEntity.type === "merger" && leftEntity.leavingDirection === "right"){
          leftEntity.target = stock.id;}
      }
      if (rightEntity) {
        if (
          rightEntity.type === "transport" &&
          rightEntity.entryDirection === "left"
        ) {
          rightEntity.source = stock.id;
        }
        if (
          rightEntity.type === "splitter" &&
          rightEntity.entryDirection === "left"
        ) {
          rightEntity.source = stock.id;
        }
        if (
          rightEntity.type === "merger" &&
          rightEntity.leavingDirection !== "left"
        ) {
          switch (rightEntity.leavingDirection) {
            case "down":
              rightEntity.source[0] = stock.id;
              break;
            case "right":
              rightEntity.source[1] = stock.id;
              break;
            case "up":
              rightEntity.source[2] = stock.id;
              break;
          }
        }
      }
      break;
    }
  }
}
