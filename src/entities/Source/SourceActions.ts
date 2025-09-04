import type { GameType } from "../../types";
import type { EntitySourceType } from "../EntitiesTypes";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  val: number;
  posI: number;
  posJ: number;
};

export type GameActionDeleteSource = {
  type: "delete source";
  id: string;
};

export function createSource(state: GameType, max: number, posI: number, posJ:number) {
  if (posI >= state.rows || posJ >= state.cols){ //validacao da posicao
    return state;
  }

  let numberID: number = 1;
  if (state.sources.length > 0) {
    const lastSourceNumber = state.sources
      .map((sourceId) => parseInt(sourceId.replace("source", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastSourceNumber + 1;
  }

  const newState = structuredClone(state);
  const newSourceID: string = "source" + numberID;
  const newSourceEntity: EntitySourceType = {
    id: newSourceID,
    name: "Source " + numberID,
    type: "source",
    val: 0,
    max: max,
    cooldown: 1,
    rate: 1,
  };
  newState.entities.set(newSourceID, newSourceEntity);
  newState.sources.push(newSourceID);
  //define posicao no tabuleiro
  const boardPosition = posI * newState.cols + posJ;
  newState.board[boardPosition] = newSourceID;
  return newState;
}

export function deleteSource(state: GameType, source: string) {
  const sourceIndex = state.sources.indexOf(source); //pelo createSource ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (sourceIndex !== -1) {
    const newState = structuredClone(state);
    newState.sources.splice(sourceIndex);
    newState.entities.delete(source);
    return newState;
  }
  return state;
}
