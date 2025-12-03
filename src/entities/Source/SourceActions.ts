import type { GameType } from "../../types";
import type { EntitySourceType } from "../EntitiesTypes";
import { updateConnections } from "../Transport/TransportActions";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  val: number;
  x: number;
  y: number;
};

export type GameActionDeleteSource = {
  type: "delete source";
  id: string;
};

export function createSource(state: GameType, max: number, x: number, y:number) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y
    )
  ) {
    //checagem se ja existe entidade na posicao
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
    x: x,
    y: y,
    leavingDirection: "left",
  };
  newState.entities.set(newSourceID, newSourceEntity);
  newState.sources.push(newSourceID);
  updateConnections(newState, newSourceEntity);
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
