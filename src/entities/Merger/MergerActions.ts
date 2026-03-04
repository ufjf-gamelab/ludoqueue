import type { GameType } from "../../types";
import type { DirectionType, EntityMergerType } from "../EntitiesTypes";

export type GameActionCreateMerger = {
  type: "create merger";
  rate: number;
  max: number;
  x: number;
  y: number;
  leavingDirection: DirectionType;
};

export type GameActionDeleteMerger = {
  type: "delete merger";
  id: string;
};

export type GameActionChangeMergerLeavingDirection = {
  type: "change merger leaving direction";
  id: string;
  direction: DirectionType;
};

export function createMerger(
  state: GameType,
  max: number,
  rate: number,
  x: number,
  y: number,
  leavingDirection: DirectionType,
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y,
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  //determina ID do merger
  let numberID: number = 1;
  if (state.mergers.length > 0) {
    const lastMergerNumber = state.mergers
      .map((mergerId) => parseInt(mergerId.replace("merger", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastMergerNumber + 1;
  }

  const newState = structuredClone(state);
  const newMergerID: string = "merger" + numberID;
  const newMergerEntity: EntityMergerType = {
    id: newMergerID,
    name: "Merger " + numberID,
    type: "merger",
    val: 0,
    max: max,
    rate: rate,
    cooldown: 1,
    source: null,
    target: [null, null, null],
    x,
    y,
    leavingDirection,
    movingGoods: [],
    nextTargetIndex: 0,
  };
  newState.entities.set(newMergerID, newMergerEntity);
  newState.mergers.push(newMergerID);
  //updateMergerConnections(newState, newMergerEntity);
  return newState;
}

export function deleteMerger(state: GameType, merger: string) {
  const mergerIndex = state.mergers.indexOf(merger); //pelo createMerger ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (mergerIndex !== -1) {
    const newState = structuredClone(state);
    newState.mergers.splice(mergerIndex);
    newState.entities.delete(merger);
    return newState;
  }
  return state;
}
