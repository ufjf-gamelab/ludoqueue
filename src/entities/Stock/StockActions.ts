import type { GameType } from "../../types";
import type { EntityStockType } from "../EntitiesTypes";
import { updateTransporters } from "../Transport/TransportActions";


export type GameActionCreateStock = {
  type: "create stock";
  max: number;
  val: number;
  x: number;
  y: number;
};

export type GameActionDeleteStock = {
  type: "delete stock";
  id: string;
};

export function createStock(state: GameType, max: number, x: number, y:number) {
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
    x: x,
    y: y,
  };
  newState.entities.set(newStockID, newStockEntity);
  newState.stocks.push(newStockID);
  updateTransporters(newState,newStockID, x, y);
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
