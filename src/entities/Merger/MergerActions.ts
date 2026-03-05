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
    target: null,
    source: [null, null, null],
    x,
    y,
    leavingDirection,
    movingGoods: [],
    nextSourceIndex: 0,
  };
  newState.entities.set(newMergerID, newMergerEntity);
  newState.mergers.push(newMergerID);
  updateMergerConnections(newState, newMergerEntity);
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
  let targetEntity =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === merger.x - 1 && entity.y === merger.y,
    ) || null;
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
      (targetEntity.type === "source"))
  ) {
    targetEntity = null;
  }
  if (targetEntity) {
    if (targetEntity.type === "transport" && targetEntity.entryDirection === "right") {
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "splitter" && targetEntity.entryDirection === "right"){
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "merger" && targetEntity.leavingDirection !== "right"){
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

  let source0Entity =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === merger.x && entity.y === merger.y - 1,
    ) || null; //cima
  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "down") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "down") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection === "down") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "down")
      || (source0Entity.type === "source" && source0Entity.leavingDirection !== "down"))
  ) {
    source0Entity = null;
  }

  let source1Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x + 1 && entity.y === merger.y,
  ) || null; //direita
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
      (source1Entity.type === "source" && source1Entity.leavingDirection !== "left"))
  ) {
    source1Entity = null;
  }

  let source2Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x && entity.y === merger.y + 1,
  ) || null; //baixo
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
      (source2Entity.type === "source" && source2Entity.leavingDirection !== "up"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    if (source0Entity.type === "transport"){
      source0Entity.target = merger.id;
    }
    if (source0Entity.type === "splitter"){
      const spliterEntity = source0Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[1] = merger.id;
          break;
        case "left":
          spliterEntity.target[2] = merger.id;
          break;
        case "right":
          spliterEntity.target[0] = merger.id;
          break;
      }
    }
    if (source0Entity.type === "merger"){
    source0Entity.target = merger.id;
  }
    merger.source[0] = source0Entity.id;
  }
  if (source1Entity) {
    if (source1Entity.type === "transport"){
      source1Entity.target = merger.id;
    }
    if (source1Entity.type === "splitter"){
      const spliterEntity = source1Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[2] = merger.id;
          break;
        case "down":
          spliterEntity.target[0] = merger.id;
          break;
        case "right":
          spliterEntity.target[1] = merger.id;
          break;
      }
    }
    if (source1Entity.type === "merger"){
    source1Entity.target = merger.id;
  }
    merger.source[1] = source1Entity.id;
  }
  if (source2Entity) {
    if (source2Entity.type === "transport"){
      source2Entity.target = merger.id;
    }
    if (source2Entity.type === "splitter"){
      const spliterEntity = source2Entity;
      switch (spliterEntity.entryDirection) {
        case "down":
          spliterEntity.target[1] = merger.id;
          break;
        case "left":
          spliterEntity.target[0] = merger.id;
          break;
        case "right":
          spliterEntity.target[2] = merger.id;
          break;
      }
    }
    if (source2Entity.type === "merger"){
    source2Entity.target = merger.id;
  }
    merger.source[2] = source2Entity.id;
  }
}

function updateMergerRightEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === merger.x + 1 && entity.y === merger.y,
    ) || null;
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
    if (targetEntity.type === "transport" && targetEntity.entryDirection === "left") {
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "splitter" && targetEntity.entryDirection === "left"){
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "merger" && targetEntity.leavingDirection !== "left"){
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


  let source0Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x && entity.y === merger.y + 1,
  ) || null; //baixo
  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "up") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "up") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection !== "up") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "up")
      || (source0Entity.type === "source" && source0Entity.leavingDirection !== "up"))
  ) {
    source0Entity = null;
  }


  let source1Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x - 1 && entity.y === merger.y,
  ) || null; //esquerda
  if (
    source1Entity &&
    (source1Entity.type === "consumer" ||
      (source1Entity.type === "stock" && source1Entity.direction !== "right") ||
      (source1Entity.type === "transport" &&
        source1Entity.leavingDirection !== "right") ||
      (source1Entity.type === "splitter" &&
        source1Entity.entryDirection === "right") ||
      (source1Entity.type === "merger" &&
        source1Entity.leavingDirection !== "right")
      || (source1Entity.type === "source" && source1Entity.leavingDirection !== "right"))
  ) {
    source1Entity = null;
  }

  let source2Entity =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === merger.x && entity.y === merger.y - 1,
    ) || null; //cima
  if (
    source2Entity &&
    (source2Entity.type === "consumer" ||
      (source2Entity.type === "stock" && source2Entity.direction !== "down") ||
      (source2Entity.type === "transport" &&
        source2Entity.leavingDirection !== "down") ||
      (source2Entity.type === "splitter" &&
        source2Entity.entryDirection === "down") ||
      (source2Entity.type === "merger" &&
        source2Entity.leavingDirection !== "down")
      || (source2Entity.type === "source" && source2Entity.leavingDirection !== "down"))
  ) {
    source2Entity = null;
  }
  
  if (source0Entity) {
    if (source0Entity.type === "transport"){
      source0Entity.target = merger.id;
    }
    if (source0Entity.type === "splitter"){
      const spliterEntity = source0Entity;
      switch (spliterEntity.entryDirection) {
        case "down":
          spliterEntity.target[1] = merger.id;
          break;
        case "left":
          spliterEntity.target[0] = merger.id;
          break;
        case "right":
          spliterEntity.target[2] = merger.id;
          break;
      }
    }
    if (source0Entity.type === "merger"){
    source0Entity.target = merger.id;
  }
    merger.source[0] = source0Entity.id;
  }
  if (source1Entity) {
    if(source1Entity.type === "transport"){
      source1Entity.target = merger.id;
    }
    if (source1Entity.type === "splitter"){
      const spliterEntity = source1Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[0] = merger.id;
          break;
        case "down":
          spliterEntity.target[2] = merger.id;
          break;
        case "left":
          spliterEntity.target[1] = merger.id;
          break;
      }
    }
    if (source1Entity.type === "merger"){
    source1Entity.target = merger.id;
  }
    merger.source[1] = source1Entity.id;
  }
  if (source2Entity) {
    if (source2Entity.type === "transport"){
      source2Entity.target = merger.id;
    }
    if (source2Entity.type === "splitter"){
      const spliterEntity = source2Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[1] = merger.id;
          break;
        case "left":
          spliterEntity.target[2] = merger.id;
          break;
        case "right":
          spliterEntity.target[0] = merger.id;
          break;
      }
    }
    if (source2Entity.type === "merger"){
    source2Entity.target = merger.id;
  }
    merger.source[2] = source2Entity.id;
  }
}

function updateMergerUpperEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === merger.x && entity.y === merger.y - 1,
    ) || null;
  if (
    targetEntity &&
    ((targetEntity.type === "consumer" && targetEntity.entryDirection !== "down") ||
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
    if (targetEntity.type === "transport" && targetEntity.entryDirection === "down") {
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "splitter" && targetEntity.entryDirection === "down"){
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "merger" && targetEntity.leavingDirection !== "down"){
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

  let source0Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x + 1 && entity.y === merger.y,
  ) || null; //direita
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
      (source0Entity.type === "source" && source0Entity.leavingDirection !== "left"))
  ) {
    source0Entity = null;
  }

  let source1Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x && entity.y === merger.y+1,
  ) || null; //baixo
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
      (source1Entity.type === "source" && source1Entity.leavingDirection !== "up"))
  ) {
    source1Entity = null;
  }

let source2Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x - 1 && entity.y === merger.y,
  ) || null; //esquerda
  if (
    source2Entity &&
    (source2Entity.type === "consumer" ||
      (source2Entity.type === "stock" && source2Entity.direction !== "right") ||
      (source2Entity.type === "transport" &&
        source2Entity.leavingDirection !== "right") ||
      (source2Entity.type === "splitter" &&
        source2Entity.entryDirection === "right") ||
      (source2Entity.type === "merger" &&
        source2Entity.leavingDirection !== "right")
      || (source2Entity.type === "source" && source2Entity.leavingDirection !== "right"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    if (source0Entity.type === "transport"){
      source0Entity.target = merger.id;
    }
    if (source0Entity.type === "splitter"){
      const spliterEntity = source0Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[2] = merger.id;
          break;
        case "down":
          spliterEntity.target[0] = merger.id;
          break;
        case "right":
          spliterEntity.target[1] = merger.id;
          break;
      }
    }
  if (source0Entity.type === "merger"){
    source0Entity.target = merger.id;
  }
    merger.source[0] = source0Entity.id;
  }
  if (source1Entity) {
    if (source1Entity.type === "transport"){
      source1Entity.target = merger.id;
    }
    if (source1Entity.type === "splitter"){
      const spliterEntity = source1Entity;
      switch (spliterEntity.entryDirection) {
        case "down":
          spliterEntity.target[1] = merger.id;
          break;
        case "left":
          spliterEntity.target[0] = merger.id;
          break;
        case "right":
          spliterEntity.target[2] = merger.id;
          break;
      }
    }
    if (source1Entity.type === "merger"){
    source1Entity.target = merger.id;
  }
    merger.source[1] = source1Entity.id;
  }
  if (source2Entity) {
    if(source2Entity.type === "transport"){
      source2Entity.target = merger.id;
    }
    if (source2Entity.type === "splitter"){
      const spliterEntity = source2Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[0] = merger.id;
          break;
        case "down":
          spliterEntity.target[2] = merger.id;
          break;
        case "left":
          spliterEntity.target[1] = merger.id;
          break;
      }
    }
    if (source2Entity.type === "merger"){
    source2Entity.target = merger.id;
  }
    merger.source[2] = source2Entity.id;
  }
}

function updateMergerDownEntry(state: GameType, merger: EntityMergerType) {
  let targetEntity =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === merger.x && entity.y === merger.y + 1,
    ) || null;
  if (
    targetEntity &&
    ((targetEntity.type === "consumer" && targetEntity.entryDirection !== "up") ||
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
    if (targetEntity.type === "transport" && targetEntity.entryDirection === "up") {
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "splitter" && targetEntity.entryDirection === "up"){
      targetEntity.source = merger.id;
    }
    if (targetEntity.type === "merger" && targetEntity.leavingDirection !== "up"){
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

let source0Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x - 1 && entity.y === merger.y,
  ) || null; //esquerda
  if (
    source0Entity &&
    (source0Entity.type === "consumer" ||
      (source0Entity.type === "stock" && source0Entity.direction !== "right") ||
      (source0Entity.type === "transport" &&
        source0Entity.leavingDirection !== "right") ||
      (source0Entity.type === "splitter" &&
        source0Entity.entryDirection === "right") ||
      (source0Entity.type === "merger" &&
        source0Entity.leavingDirection !== "right")
      || (source0Entity.type === "source" && source0Entity.leavingDirection !== "right"))
  ) {
    source0Entity = null;
  }

  let source1Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x && entity.y === merger.y-1,
  ) || null; //cima
  if (
    source1Entity &&
    (source1Entity.type === "consumer" ||
      (source1Entity.type === "stock" && source1Entity.direction !== "down") ||
      (source1Entity.type === "transport" &&
        source1Entity.leavingDirection !== "down") ||
      (source1Entity.type === "splitter" &&
        source1Entity.entryDirection === "down") ||
      (source1Entity.type === "merger" &&
        source1Entity.leavingDirection !== "down")
      || (source1Entity.type === "source" && source1Entity.leavingDirection !== "down"))
  ) {
    source1Entity = null;
  }

  let source2Entity = Array.from(state.entities.values()).find(
    (entity) => entity.x === merger.x + 1 && entity.y === merger.y,
  ) || null; //direita
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
      (source2Entity.type === "source" && source2Entity.leavingDirection !== "left"))
  ) {
    source2Entity = null;
  }

  if (source0Entity) {
    if(source0Entity.type === "transport"){
      source0Entity.target = merger.id;
    }
    if (source0Entity.type === "splitter"){
      const spliterEntity = source0Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[0] = merger.id;
          break;
        case "down":
          spliterEntity.target[2] = merger.id;
          break;
        case "left":
          spliterEntity.target[1] = merger.id;
          break;
      }
    }
    if (source0Entity.type === "merger"){
    source0Entity.target = merger.id;
  }
    merger.source[0] = source0Entity.id;
  }
  if (source1Entity) {
    if (source1Entity.type === "transport"){
      source1Entity.target = merger.id;
    }
    if (source1Entity.type === "splitter"){
      const spliterEntity = source1Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[1] = merger.id;
          break;
        case "left":
          spliterEntity.target[2] = merger.id;
          break;
        case "right":
          spliterEntity.target[0] = merger.id;
          break;
      }
    }
    if (source1Entity.type === "merger"){
    source1Entity.target = merger.id;
  }
    merger.source[1] = source1Entity.id;
  }
  if (source2Entity) {
    if (source2Entity.type === "transport"){
      source2Entity.target = merger.id;
    }
    if (source2Entity.type === "splitter"){
      const spliterEntity = source2Entity;
      switch (spliterEntity.entryDirection) {
        case "up":
          spliterEntity.target[2] = merger.id;
          break;
        case "down":
          spliterEntity.target[0] = merger.id;
          break;
        case "right":
          spliterEntity.target[1] = merger.id;
          break;
      }
    }
    if (source2Entity.type === "merger"){
    source2Entity.target = merger.id;
  }
    merger.source[2] = source2Entity.id;
  }
}
