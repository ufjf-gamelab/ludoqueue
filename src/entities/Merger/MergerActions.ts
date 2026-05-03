import type { GameType } from "../../GameTypes";
import {
  canOutputTo,
  canReceiveFrom,
  linkEntities,
} from "../EntitiesConnections";
import {
  getInvertedDirection,
  type DirectionType,
  type EntityMergerType,
} from "../EntitiesTypes";
import {
  clearConnectionsToEntity,
  getNeighbor,
  getOtherDirections,
} from "../EntityCommonActions";

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
    max: max,
    rate: rate,
    cooldown: 1,
    target: null,
    sources: [],
    x,
    y,
    leavingDirection,
    movingGoods: [],
    nextSourceIndex: 0,
    goods: [],
  };
  newState.entities.set(newMergerID, newMergerEntity);
  newState.mergers.push(newMergerID);
  updateMergerConnections(newState, newMergerEntity);
  return newState;
}

export function deleteMerger(state: GameType, merger: string) {
  const mergerIndex = state.mergers.indexOf(merger); // pelo createMerger ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (mergerIndex !== -1) {
    const newState = structuredClone(state);
    const mergerEntity = newState.entities.get(newState.mergers[mergerIndex]);
    clearConnectionsToEntity(newState, mergerEntity!);
    newState.mergers.splice(mergerIndex, 1);
    newState.entities.delete(merger);
    return newState;
  }
  return state;
}

export function changeMergerLeavingDirection(
  state: GameType,
  mergerId: string,
  direction: DirectionType,
) {
  const merger = state.entities.get(mergerId);
  if (!merger || merger.type !== "merger") {
    return state;
  }
  const newState = structuredClone(state);
  const newMerger = newState.entities.get(mergerId) as EntityMergerType;
  newMerger.leavingDirection = direction;
  updateMergerConnections(newState, newMerger);
  return newState;
}

export function updateMergerConnections(
  state: GameType,
  merger: EntityMergerType,
) {
  merger.target = null;
  merger.sources = [];
  clearConnectionsToEntity(state, merger);

  const targetEntity = getNeighbor(state, merger, merger.leavingDirection);
  if (targetEntity && canReceiveFrom(targetEntity, merger.leavingDirection)) {
    linkEntities(merger, targetEntity);
  }

  const otherDirs = getOtherDirections(
    merger.leavingDirection,
  ) as DirectionType[];
  for (const direction of otherDirs) {
    const sourceEntity = getNeighbor(state, merger, direction);
    const invDirection = getInvertedDirection(direction);
    if (sourceEntity && canOutputTo(sourceEntity, invDirection)) {
      linkEntities(sourceEntity, merger);
    }
  }
}
