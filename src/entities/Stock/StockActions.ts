import type { GameType } from "../../types";
import type { EntityStockType } from "../EntitiesTypes";


export type GameActionCreateStock = {
  type: "create stock";
  max: number;
  val: number;
  posI: number;
  posJ: number;
};

export type GameActionDeleteStock = {
  type: "delete stock";
  id: string;
};

export function createStock(state: GameType, max: number, posI: number, posJ:number) {
  if (posI >= state.rows || posJ >= state.cols){ //validacao da posicao
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
  };
  newState.entities.set(newStockID, newStockEntity);
  newState.stocks.push(newStockID);

  //define posicao no tabuleiro
  const boardPosition = posI * newState.cols + posJ;
  newState.board[boardPosition] = newStockID;
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
