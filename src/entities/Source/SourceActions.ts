import type { EntityMineType, GameType } from "../../types";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  val: number;
};

export type GameActionDeleteSource = {
  type: "delete source";
  id: string;
};

export function createSource(state: GameType, max: number) {
  let numberID: number = 1;
  if (state.mines.length > 0) {
    const lastSourceNumber = state.mines
      .map((sourceId) => parseInt(sourceId.replace("source", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastSourceNumber + 1;
  }

  const newState = structuredClone(state);
  const newSourceID: string = "source" + numberID;
  const newSourceEntity: EntityMineType = {
    id: newSourceID,
    name: "Source " + numberID,
    type: "mine",
    val: 0,
    max: max,
    cooldown: 1,
    rate: 1
  };
  newState.entities.set(newSourceID, newSourceEntity);
  newState.mines.push(newSourceID);
  return newState;
}

export function deleteSource(state: GameType, source: string) {
  const sourceIndex = state.mines.indexOf(source); //pelo createSource ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (sourceIndex !== -1) {
    const newState = structuredClone(state);
    newState.mines.splice(sourceIndex);
    newState.entities.delete(source);
    return newState;
  }
  return state;
}
