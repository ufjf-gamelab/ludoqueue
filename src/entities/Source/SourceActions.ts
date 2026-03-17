import type { GameType } from "../../types";
import type { DirectionType, EntitySourceType, GoodType } from "../EntitiesTypes";
import { clearConnectionsToEntity, getEntityAt, tryToConnectSource } from "../EntityActions";

export type GameActionCreateSource = {
  type: "create source";
  max: number;
  x: number;
  y: number;
  goodType: GoodType;
  leavingDirection: DirectionType;
};

export type GameActionDeleteSource = {
  type: "delete source";
  id: string;
};

export type GameActionChangeSourceLeavingDirection = {
  type: "change source leaving direction";
  id: string;
  direction: DirectionType;
};

export type GameActionChangeSourceGoodType
 = {
  type: "change source good type";
  id: string;
  goodType: GoodType;
}

export function createSource(state: GameType, max: number, x: number, y:number, leavingDirection: DirectionType, goodType: GoodType) {
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
    max: max,
    cooldown: 1,
    rate: 1,
    x,
    y,
    leavingDirection,
    goodType,
    goods: [],
  };
  newState.entities.set(newSourceID, newSourceEntity);
  newState.sources.push(newSourceID);
  updateSourceConnections(newState, newSourceEntity);
  return newState;
}

export function deleteSource(state: GameType, source: string) {
  const sourceIndex = state.sources.indexOf(source); //pelo createSource ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (sourceIndex !== -1) {
    const newState = structuredClone(state);
    const sourceEntity = newState.entities.get(newState.sources[sourceIndex]);
    clearConnectionsToEntity(newState,sourceEntity!);
    newState.sources.splice(sourceIndex);
    newState.entities.delete(source);
    return newState;
  }
  return state;
}

export function changeSourceLeavingDirection(state: GameType, sourceID: string, direction: DirectionType) {
  const sourceEntity = state.entities.get(sourceID) as EntitySourceType | undefined;
  if (!sourceEntity || direction === sourceEntity.leavingDirection) {
    return state;
  }
  const newState = structuredClone(state);
  const newSourceEntity = newState.entities.get(sourceID) as EntitySourceType;
  newSourceEntity.leavingDirection = direction;
  updateSourceConnections(newState, newSourceEntity);
  return newState;
}

export function changeSourceGoodType(state: GameType, sourceID: string, goodType: GoodType) {
  const sourceEntity = state.entities.get(sourceID) as EntitySourceType | undefined;
  if (!sourceEntity || goodType === sourceEntity.goodType) {
    return state;
  }
  const newState = structuredClone(state);
  const newSourceEntity = newState.entities.get(sourceID) as EntitySourceType;
  newSourceEntity.goodType = goodType;
  return newState;
}



function updateSourceConnections(
  state: GameType,
  source: EntitySourceType
) {

  // limpar conexões antigas
  clearConnectionsToEntity(state, source);

  switch (source.leavingDirection) {

    case "up": {

      const upperEntity = getEntityAt(state, source.x, source.y - 1)

      if (!upperEntity) break

      tryToConnectSource(upperEntity, "down", source.id)

      if (
        upperEntity.type === "merger" &&
        upperEntity.leavingDirection !== "down"
      ) {
        switch (upperEntity.leavingDirection) {
          case "up":
            upperEntity.source[1] = source.id
            break
          case "left":
            upperEntity.source[2] = source.id
            break
          case "right":
            upperEntity.source[0] = source.id
            break
        }
      }

      break
    }

    case "down": {

      const lowerEntity = getEntityAt(state, source.x, source.y + 1)

      if (!lowerEntity) break

      tryToConnectSource(lowerEntity, "up", source.id)

      if (
        lowerEntity.type === "merger" &&
        lowerEntity.leavingDirection !== "up"
      ) {
        switch (lowerEntity.leavingDirection) {
          case "down":
            lowerEntity.source[1] = source.id
            break
          case "left":
            lowerEntity.source[0] = source.id
            break
          case "right":
            lowerEntity.source[2] = source.id
            break
        }
      }

      break
    }

    case "left": {

      const leftEntity = getEntityAt(state, source.x - 1, source.y)

      if (!leftEntity) break

      tryToConnectSource(leftEntity, "right", source.id)

      if (
        leftEntity.type === "merger" &&
        leftEntity.leavingDirection !== "right"
      ) {
        switch (leftEntity.leavingDirection) {
          case "up":
            leftEntity.source[0] = source.id
            break
          case "down":
            leftEntity.source[2] = source.id
            break
          case "left":
            leftEntity.source[1] = source.id
            break
        }
      }

      break
    }

    case "right": {

      const rightEntity = getEntityAt(state, source.x + 1, source.y)

      if (!rightEntity) break

      tryToConnectSource(rightEntity, "left", source.id)

      if (
        rightEntity.type === "merger" &&
        rightEntity.leavingDirection !== "left"
      ) {
        switch (rightEntity.leavingDirection) {
          case "up":
            rightEntity.source[2] = source.id
            break
          case "down":
            rightEntity.source[0] = source.id
            break
          case "right":
            rightEntity.source[1] = source.id
            break
        }
      }

      break
    }

  }

}
