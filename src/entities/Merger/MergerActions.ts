import type { GameType } from "../../types";
import type {
  DirectionType,
  EntityMergerType,
} from "../EntitiesTypes";
import {
  clearConnectionsToEntity,
  getEntityAt,
  tryToConnectSource,
  tryToConnectTarget,
} from "../EntityActions";

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
    source: [null, null, null],
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
    clearConnectionsToEntity(newState,mergerEntity!);
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

function updateMergerConnections(state: GameType, merger: EntityMergerType) {
  merger.target = null;
  merger.source = [null, null, null];
  clearConnectionsToEntity(state,merger);
  switch (merger.leavingDirection) {
    case "up": {
      updateMergerUpperEntry(state, merger);
      break;
    }
    case "down": {
      updateMergerDownEntry(state, merger);
      break;
    }
    case "left": {
      updateMergerLeftEntry(state, merger);
      break;
    }
    case "right": {
      updateMergerRightEntry(state, merger);
      break;
    }
    default: {
      break;
    }
  }
}

function updateMergerLeftEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity = getEntityAt(state, merger.x - 1, merger.y);

  if (
    targetEntity &&
    ((targetEntity.type === "consumer" &&
      targetEntity.entryDirection !== "right") ||
      (targetEntity.type === "stock" && targetEntity.direction !== "left") ||
      (targetEntity.type === "transport" &&
        targetEntity.entryDirection !== "right") ||
      (targetEntity.type === "splitter" &&
        targetEntity.entryDirection !== "right") ||
      (targetEntity.type === "merger" &&
        targetEntity.leavingDirection === "right") ||
      targetEntity.type === "source")
  ) {
    targetEntity = null;
  }

  if (targetEntity) {
    tryToConnectSource(targetEntity, "right", merger.id);

    if (
      targetEntity.type === "merger" &&
      targetEntity.leavingDirection !== "right"
    ) {
      switch (targetEntity.leavingDirection) {
        case "up":
          targetEntity.source[0] = merger.id;
          break;
        case "down":
          targetEntity.source[2] = merger.id;
          break;
        case "left":
          targetEntity.source[1] = merger.id;
          break;
      }
    }

    merger.target = targetEntity.id;
  }

  let source0Entity = getEntityAt(state, merger.x, merger.y - 1);
  let source1Entity = getEntityAt(state, merger.x + 1, merger.y);
  let source2Entity = getEntityAt(state, merger.x, merger.y + 1);

  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "down") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "down") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection === "down") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "down") ||
      (source0Entity.type === "source" &&
        source0Entity.leavingDirection !== "down"))
  ) {
    source0Entity = null;
  }

  if (
    source1Entity &&
    (source1Entity.type === "consumer" ||
      (source1Entity.type === "stock" && source1Entity.direction !== "left") ||
      (source1Entity.type === "transport" &&
        source1Entity.leavingDirection !== "left") ||
      (source1Entity.type === "splitter" &&
        source1Entity.entryDirection === "left") ||
      (source1Entity.type === "merger" &&
        source1Entity.leavingDirection !== "left") ||
      (source1Entity.type === "source" &&
        source1Entity.leavingDirection !== "left"))
  ) {
    source1Entity = null;
  }

  if (
    source2Entity &&
    (source2Entity.type === "consumer" ||
      (source2Entity.type === "stock" && source2Entity.direction !== "up") ||
      (source2Entity.type === "transport" &&
        source2Entity.leavingDirection !== "up") ||
      (source2Entity.type === "splitter" &&
        source2Entity.entryDirection !== "up") ||
      (source2Entity.type === "merger" &&
        source2Entity.leavingDirection !== "up") ||
      (source2Entity.type === "source" &&
        source2Entity.leavingDirection !== "up"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    tryToConnectTarget(source0Entity, "down", merger.id);

    if (source0Entity.type === "splitter") {
      switch (source0Entity.entryDirection) {
        case "up":
          source0Entity.target[1] = merger.id;
          break;
        case "left":
          source0Entity.target[2] = merger.id;
          break;
        case "right":
          source0Entity.target[0] = merger.id;
          break;
      }
    }

    merger.source[0] = source0Entity.id;
  }

  if (source1Entity) {
    tryToConnectTarget(source1Entity, "left", merger.id);

    if (source1Entity.type === "splitter") {
      switch (source1Entity.entryDirection) {
        case "up":
          source1Entity.target[2] = merger.id;
          break;
        case "down":
          source1Entity.target[0] = merger.id;
          break;
        case "right":
          source1Entity.target[1] = merger.id;
          break;
      }
    }

    merger.source[1] = source1Entity.id;
  }

  if (source2Entity) {
    tryToConnectTarget(source2Entity, "up", merger.id);

    if (source2Entity.type === "splitter") {
      switch (source2Entity.entryDirection) {
        case "down":
          source2Entity.target[1] = merger.id;
          break;
        case "left":
          source2Entity.target[0] = merger.id;
          break;
        case "right":
          source2Entity.target[2] = merger.id;
          break;
      }
    }

    merger.source[2] = source2Entity.id;
  }
}

function updateMergerRightEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity = getEntityAt(state, merger.x + 1, merger.y);
  if (
    targetEntity &&
    ((targetEntity.type === "consumer" &&
      targetEntity.entryDirection !== "left") ||
      (targetEntity.type === "stock" && targetEntity.direction !== "right") ||
      (targetEntity.type === "transport" &&
        targetEntity.entryDirection !== "left") ||
      (targetEntity.type === "splitter" &&
        targetEntity.entryDirection !== "left") ||
      (targetEntity.type === "merger" &&
        targetEntity.leavingDirection === "left") ||
      targetEntity.type === "source")
  ) {
    targetEntity = null;
  }
  if (targetEntity) {
    tryToConnectSource(targetEntity, "left", merger.id);
    if (
      targetEntity.type === "merger" &&
      targetEntity.leavingDirection !== "left"
    ) {
      switch (targetEntity.leavingDirection) {
        case "up":
          targetEntity.source[2] = merger.id;
          break;
        case "down":
          targetEntity.source[0] = merger.id;
          break;
        case "right":
          targetEntity.source[1] = merger.id;
          break;
      }
    }
    merger.target = targetEntity.id;
  }

  let source0Entity = getEntityAt(state, merger.x, merger.y + 1); // baixo
  let source1Entity = getEntityAt(state, merger.x - 1, merger.y); // esquerda
  let source2Entity = getEntityAt(state, merger.x, merger.y - 1); // cima

  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "up") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "up") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection !== "up") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "up") ||
      (source0Entity.type === "source" &&
        source0Entity.leavingDirection !== "up"))
  ) {
    source0Entity = null;
  }

  if (
    source1Entity &&
    (source1Entity.type === "consumer" ||
      (source1Entity.type === "stock" && source1Entity.direction !== "right") ||
      (source1Entity.type === "transport" &&
        source1Entity.leavingDirection !== "right") ||
      (source1Entity.type === "splitter" &&
        source1Entity.entryDirection === "right") ||
      (source1Entity.type === "merger" &&
        source1Entity.leavingDirection !== "right") ||
      (source1Entity.type === "source" &&
        source1Entity.leavingDirection !== "right"))
  ) {
    source1Entity = null;
  }

  if (
    source2Entity &&
    (source2Entity.type === "consumer" ||
      (source2Entity.type === "stock" && source2Entity.direction !== "down") ||
      (source2Entity.type === "transport" &&
        source2Entity.leavingDirection !== "down") ||
      (source2Entity.type === "splitter" &&
        source2Entity.entryDirection === "down") ||
      (source2Entity.type === "merger" &&
        source2Entity.leavingDirection !== "down") ||
      (source2Entity.type === "source" &&
        source2Entity.leavingDirection !== "down"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    tryToConnectTarget(source0Entity, "up", merger.id);

    if (source0Entity.type === "splitter") {
      const splitterEntity = source0Entity;
      switch (splitterEntity.entryDirection) {
        case "down":
          splitterEntity.target[1] = merger.id;
          break;
        case "left":
          splitterEntity.target[0] = merger.id;
          break;
        case "right":
          splitterEntity.target[2] = merger.id;
          break;
      }
    }

    merger.source[0] = source0Entity.id;
  }

  if (source1Entity) {
    tryToConnectTarget(source1Entity, "right", merger.id);

    if (source1Entity.type === "splitter") {
      const splitterEntity = source1Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[0] = merger.id;
          break;
        case "down":
          splitterEntity.target[2] = merger.id;
          break;
        case "left":
          splitterEntity.target[1] = merger.id;
          break;
      }
    }

    merger.source[1] = source1Entity.id;
  }

  if (source2Entity) {
    tryToConnectTarget(source2Entity, "down", merger.id);

    if (source2Entity.type === "splitter") {
      const splitterEntity = source2Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[1] = merger.id;
          break;
        case "left":
          splitterEntity.target[2] = merger.id;
          break;
        case "right":
          splitterEntity.target[0] = merger.id;
          break;
      }
    }

    merger.source[2] = source2Entity.id;
  }
}

function updateMergerUpperEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity = getEntityAt(state, merger.x, merger.y - 1);
  if (
    targetEntity &&
    ((targetEntity.type === "consumer" &&
      targetEntity.entryDirection !== "down") ||
      (targetEntity.type === "stock" && targetEntity.direction !== "up") ||
      (targetEntity.type === "transport" &&
        targetEntity.entryDirection !== "down") ||
      (targetEntity.type === "splitter" &&
        targetEntity.entryDirection !== "down") ||
      (targetEntity.type === "merger" &&
        targetEntity.leavingDirection === "down") ||
      targetEntity.type === "source")
  ) {
    targetEntity = null;
  }
  if (targetEntity) {
    tryToConnectSource(targetEntity, "down", merger.id);
    if (
      targetEntity.type === "merger" &&
      targetEntity.leavingDirection !== "down"
    ) {
      switch (targetEntity.leavingDirection) {
        case "up":
          targetEntity.source[1] = merger.id;
          break;
        case "left":
          targetEntity.source[2] = merger.id;
          break;
        case "right":
          targetEntity.source[0] = merger.id;
          break;
      }
    }
    merger.target = targetEntity.id;
  }

  let source0Entity = getEntityAt(state, merger.x + 1, merger.y); //direita
  let source1Entity = getEntityAt(state, merger.x, merger.y + 1); //baixo
  let source2Entity = getEntityAt(state, merger.x - 1, merger.y); //esquerda

  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "left") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "left") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection === "left") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "left") ||
      (source0Entity.type === "source" &&
        source0Entity.leavingDirection !== "left"))
  ) {
    source0Entity = null;
  }

  if (
    source1Entity &&
    (source1Entity.type === "consumer" ||
      (source1Entity.type === "stock" && source1Entity.direction !== "up") ||
      (source1Entity.type === "transport" &&
        source1Entity.leavingDirection !== "up") ||
      (source1Entity.type === "splitter" &&
        source1Entity.entryDirection === "up") ||
      (source1Entity.type === "merger" &&
        source1Entity.leavingDirection !== "up") ||
      (source1Entity.type === "source" &&
        source1Entity.leavingDirection !== "up"))
  ) {
    source1Entity = null;
  }

  if (
    source2Entity &&
    (source2Entity.type === "consumer" ||
      (source2Entity.type === "stock" && source2Entity.direction !== "right") ||
      (source2Entity.type === "transport" &&
        source2Entity.leavingDirection !== "right") ||
      (source2Entity.type === "splitter" &&
        source2Entity.entryDirection === "right") ||
      (source2Entity.type === "merger" &&
        source2Entity.leavingDirection !== "right") ||
      (source2Entity.type === "source" &&
        source2Entity.leavingDirection !== "right"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    tryToConnectTarget(source0Entity, "left", merger.id);

    if (source0Entity.type === "splitter") {
      const splitterEntity = source0Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[2] = merger.id;
          break;
        case "down":
          splitterEntity.target[0] = merger.id;
          break;
        case "right":
          splitterEntity.target[1] = merger.id;
          break;
      }
    }

    merger.source[0] = source0Entity.id;
  }

  if (source1Entity) {
    tryToConnectTarget(source1Entity, "up", merger.id);

    if (source1Entity.type === "splitter") {
      const splitterEntity = source1Entity;
      switch (splitterEntity.entryDirection) {
        case "down":
          splitterEntity.target[1] = merger.id;
          break;
        case "left":
          splitterEntity.target[0] = merger.id;
          break;
        case "right":
          splitterEntity.target[2] = merger.id;
          break;
      }
    }

    merger.source[1] = source1Entity.id;
  }

  if (source2Entity) {
    tryToConnectTarget(source2Entity, "right", merger.id);

    if (source2Entity.type === "splitter") {
      const splitterEntity = source2Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[0] = merger.id;
          break;
        case "down":
          splitterEntity.target[2] = merger.id;
          break;
        case "left":
          splitterEntity.target[1] = merger.id;
          break;
      }
    }

    merger.source[2] = source2Entity.id;
  }
}

function updateMergerDownEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity = getEntityAt(state, merger.x, merger.y + 1);
  if (
    targetEntity &&
    ((targetEntity.type === "consumer" &&
      targetEntity.entryDirection !== "up") ||
      (targetEntity.type === "stock" && targetEntity.direction !== "down") ||
      (targetEntity.type === "transport" &&
        targetEntity.entryDirection !== "up") ||
      (targetEntity.type === "splitter" &&
        targetEntity.entryDirection !== "up") ||
      (targetEntity.type === "merger" &&
        targetEntity.leavingDirection === "up") ||
      targetEntity.type === "source")
  ) {
    targetEntity = null;
  }
  if (targetEntity) {
    tryToConnectSource(targetEntity, "up", merger.id);
    if (
      targetEntity.type === "merger" &&
      targetEntity.leavingDirection !== "up"
    ) {
      switch (targetEntity.leavingDirection) {
        case "down":
          targetEntity.source[1] = merger.id;
          break;
        case "left":
          targetEntity.source[0] = merger.id;
          break;
        case "right":
          targetEntity.source[2] = merger.id;
          break;
      }
    }
    merger.target = targetEntity.id;
  }

  let source2Entity = getEntityAt(state, merger.x + 1, merger.y); //direita
  let source1Entity = getEntityAt(state, merger.x, merger.y - 1); //cima
  let source0Entity = getEntityAt(state, merger.x - 1, merger.y); //esquerda

  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "right") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "right") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection === "right") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "right") ||
      (source0Entity.type === "source" &&
        source0Entity.leavingDirection !== "right"))
  ) {
    source0Entity = null;
  }

  if (
    source1Entity &&
    (source1Entity.type === "consumer" ||
      (source1Entity.type === "stock" && source1Entity.direction !== "down") ||
      (source1Entity.type === "transport" &&
        source1Entity.leavingDirection !== "down") ||
      (source1Entity.type === "splitter" &&
        source1Entity.entryDirection === "down") ||
      (source1Entity.type === "merger" &&
        source1Entity.leavingDirection !== "down") ||
      (source1Entity.type === "source" &&
        source1Entity.leavingDirection !== "down"))
  ) {
    source1Entity = null;
  }

  if (
    source2Entity &&
    (source2Entity.type === "consumer" ||
      (source2Entity.type === "stock" && source2Entity.direction !== "left") ||
      (source2Entity.type === "transport" &&
        source2Entity.leavingDirection !== "left") ||
      (source2Entity.type === "splitter" &&
        source2Entity.entryDirection === "left") ||
      (source2Entity.type === "merger" &&
        source2Entity.leavingDirection !== "left") ||
      (source2Entity.type === "source" &&
        source2Entity.leavingDirection !== "left"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    tryToConnectTarget(source0Entity, "right", merger.id);

    if (source0Entity.type === "splitter") {
      const splitterEntity = source0Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[0] = merger.id;
          break;
        case "down":
          splitterEntity.target[2] = merger.id;
          break;
        case "left":
          splitterEntity.target[1] = merger.id;
          break;
      }
    }

    merger.source[0] = source0Entity.id;
  }

  if (source1Entity) {
    tryToConnectTarget(source1Entity, "down", merger.id);

    if (source1Entity.type === "splitter") {
      const splitterEntity = source1Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[1] = merger.id;
          break;
        case "left":
          splitterEntity.target[2] = merger.id;
          break;
        case "right":
          splitterEntity.target[0] = merger.id;
          break;
      }
    }

    merger.source[1] = source1Entity.id;
  }

  if (source2Entity) {
    tryToConnectTarget(source2Entity, "left", merger.id);

    if (source2Entity.type === "splitter") {
      const splitterEntity = source2Entity;
      switch (splitterEntity.entryDirection) {
        case "up":
          splitterEntity.target[2] = merger.id;
          break;
        case "down":
          splitterEntity.target[0] = merger.id;
          break;
        case "right":
          splitterEntity.target[1] = merger.id;
          break;
      }
    }

    merger.source[2] = source2Entity.id;
  }
}

export function updateMergerArray(state:GameType,entity:EntityMergerType){

}
