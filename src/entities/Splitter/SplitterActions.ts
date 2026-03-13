import type { GameType } from "../../types";
import type { DirectionType, EntitySplitterType } from "../EntitiesTypes";

export type GameActionCreateSplitter = {
  type: "create splitter";
  rate: number;
  max: number;
  x: number;
  y: number;
  entryDirection: DirectionType;
};

export type GameActionDeleteSplitter = {
  type: "delete splitter";
  id: string;
};

export type GameActionChangeSplitterEntryDirection = {
  type: "change splitter entry direction";
  id: string;
  direction: DirectionType;
};

export function createSplitter(
  state: GameType,
  max: number,
  rate: number,
  x: number,
  y: number,
  entryDirection: DirectionType,
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y,
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  //determina ID do splitter
  let numberID: number = 1;
  if (state.splitters.length > 0) {
    const lastSplitterNumber = state.splitters
      .map((splitterId) => parseInt(splitterId.replace("splitter", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastSplitterNumber + 1;
  }

  const newState = structuredClone(state);
  const newSplitterID: string = "splitter" + numberID;
  const newSplitterEntity: EntitySplitterType = {
    id: newSplitterID,
    name: "Splitter " + numberID,
    type: "splitter",
    max: max,
    rate: rate,
    cooldown: 1,
    source: null,
    target: [null, null, null],
    x,
    y,
    entryDirection,
    movingGoods: [],
    nextTargetIndex: 0,
    goods: [],
  };
  newState.entities.set(newSplitterID, newSplitterEntity);
  newState.splitters.push(newSplitterID);
  updateSplitterConnections(newState, newSplitterEntity);
  return newState;
}

export function deleteSplitter(state: GameType, splitter: string) {
  const splitterIndex = state.splitters.indexOf(splitter); //pelo createSplitter ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (splitterIndex !== -1) {
    const newState = structuredClone(state);
    newState.splitters.splice(splitterIndex);
    newState.entities.delete(splitter);
    return newState;
  }
  return state;
}

export function changeSplitterEntryDirection(
  state: GameType,
  splitterID: string,
  direction: DirectionType,
) {
  const splitterEntity = state.entities.get(splitterID);
  if (splitterEntity && splitterEntity.type === "splitter") {
    const newState = structuredClone(state);
    const newSplitterEntity = newState.entities.get(
      splitterID,
    ) as EntitySplitterType;
    newSplitterEntity.entryDirection = direction;
    updateSplitterConnections(newState, newSplitterEntity);
    return newState;
  }
  return state;
}

export function updateSplitterConnections(
  state: GameType,
  splitter: EntitySplitterType,
) {
  splitter.source = null;
  splitter.target = [null, null, null];
  switch (splitter.entryDirection) {
    case "up": {
      updateSplitterUpperEntry(state, splitter);
      break;
    }
    case "down": {
      updateSplitterDownEntry(state, splitter);
      break;
    }
    case "left": {
      updateSplitterLeftEntry(state, splitter);
      break;
    }
    case "right": {
      updateSplitterRightEntry(state, splitter);
      break;
    }
    default: {
      break;
    }
  }
}

function updateSplitterUpperEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  let sourceID =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y - 1,
    )?.id ?? null;
  let sourceEntity = sourceID ? state.entities.get(sourceID) : null;
  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "down") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "down") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "down") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection == "down") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }
  if (sourceID) {
    splitter.source = sourceID;
  }
  if (sourceEntity) {
    if (
      sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection === "down"
    ) {
      const transportEntity = sourceEntity;
      transportEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "merger" &&
      sourceEntity.leavingDirection === "down"
    ) {
      const mergerEntity = sourceEntity;
      mergerEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "down"
    ) {
      const upperSplitterEntity = sourceEntity;
      switch (upperSplitterEntity.entryDirection) {
        case "up": {
          upperSplitterEntity.target[1] = splitter.id;
          break;
        }
        case "left": {
          upperSplitterEntity.target[2] = splitter.id;
          break;
        }
        case "right": {
          upperSplitterEntity.target[0] = splitter.id;
          break;
        }
      }
    }
  }
  //achar targets
  let target0 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x + 1 && entity.y === splitter.y, //direita
    )?.id ?? null;
  let target0Entity = target0 ? state.entities.get(target0) : null;
  if (
    target0Entity &&
    ((target0Entity.type === "transport" &&
      target0Entity.entryDirection !== "left") ||
      (target0Entity.type === "stock" && target0Entity.direction !== "right") ||
      (target0Entity.type === "consumer" &&
        target0Entity.entryDirection !== "left") ||
      (target0Entity.type === "splitter" &&
        target0Entity.entryDirection !== "left") ||
      (target0Entity.type === "merger" &&
        target0Entity.leavingDirection === "left") ||
      target0Entity.type === "source")
  ) {
    target0Entity = null;
    target0 = null;
  }

  let target1 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y + 1, //baixo
    )?.id ?? null;
  let target1Entity = target1 ? state.entities.get(target1) : null;
  if (
    target1Entity &&
    ((target1Entity.type === "transport" &&
      target1Entity.entryDirection !== "up") ||
      (target1Entity.type === "stock" && target1Entity.direction !== "down") ||
      (target1Entity.type === "consumer" &&
        target1Entity.entryDirection !== "up") ||
      (target1Entity.type === "splitter" &&
        target1Entity.entryDirection !== "up") ||
      (target1Entity.type === "merger" &&
        target1Entity.leavingDirection === "up") ||
      target1Entity.type === "source")
  ) {
    target1Entity = null;
    target1 = null;
  }

  let target2 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x - 1 && entity.y === splitter.y, //esquerda
    )?.id ?? null;
  let target2Entity = target2 ? state.entities.get(target2) : null;
  if (
    target2Entity &&
    ((target2Entity.type === "transport" &&
      target2Entity.entryDirection !== "right") ||
      (target2Entity.type === "stock" && target2Entity.direction !== "left") ||
      (target2Entity.type === "consumer" &&
        target2Entity.entryDirection !== "right") ||
      (target2Entity.type === "splitter" &&
        target2Entity.entryDirection !== "right") ||
      (target2Entity.type === "merger" &&
        target2Entity.leavingDirection === "right") ||
      target2Entity.type === "source")
  ) {
    target2Entity = null;
    target2 = null;
  }

  if (target0Entity) {
    if (target0Entity.type === "transport") {
      const transportEntity = target0Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "left"
    ) {
      const mergerEntity = target0Entity;
      switch (mergerEntity.leavingDirection) {
        case "up": {
          mergerEntity.source[2] = splitter.id;
          break;
        }
        case "right": {
          mergerEntity.source[1] = splitter.id;
          break;
        }
        case "down": {
          mergerEntity.source[0] = splitter.id;
          break;
        }
      }
    }
    if (target0Entity.type === "splitter") {
      target0Entity.source = splitter.id;
    }
    splitter.target[0] = target0;
  }
  if (target1Entity) {
    if (target1Entity.type === "transport") {
      const transportEntity = target1Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "up"
    ) {
      switch (target1Entity.leavingDirection) {
        case "down": {
          target1Entity.source[1] = splitter.id;
          break;
        }
        case "left": {
          target1Entity.source[0] = splitter.id;
          break;
        }
        case "right": {
          target1Entity.source[2] = splitter.id;
          break;
        }
      }
    }
    if (target1Entity.type === "splitter") {
      target1Entity.source = splitter.id;
    }
    splitter.target[1] = target1;
  }
  if (target2Entity) {
    if (target2Entity.type === "transport") {
      const transportEntity = target2Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "right"
    ) {
      switch (target2Entity.leavingDirection) {
        case "up": {
          target2Entity.source[0] = splitter.id;
          break;
        }
        case "down": {
          target2Entity.source[2] = splitter.id;
          break;
        }
        case "left": {
          target2Entity.source[1] = splitter.id;
          break;
        }
      }
    }
    if (target2Entity.type === "splitter") {
      target2Entity.source = splitter.id;
    }
    splitter.target[2] = target2;
  }
}

function updateSplitterDownEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  let sourceID =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y + 1,
    )?.id ?? null;
  let sourceEntity = sourceID ? state.entities.get(sourceID) : null;
  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "up") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "up") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "up") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection == "up") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }
  if (sourceID) {
    splitter.source = sourceID;
  }
  if (sourceEntity) {
    if (
      sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection === "down"
    ) {
      const transportEntity = sourceEntity;
      transportEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "merger" &&
      sourceEntity.leavingDirection === "up"
    ) {
      sourceEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "up"
    ) {
      const lowerSplitterEntity = sourceEntity;
      switch (lowerSplitterEntity.entryDirection) {
        case "down": {
          lowerSplitterEntity.target[1] = splitter.id;
          break;
        }
        case "left": {
          lowerSplitterEntity.target[0] = splitter.id;
          break;
        }
        case "right": {
          lowerSplitterEntity.target[2] = splitter.id;
          break;
        }
      }
    }
  }
  //achar targets
  let target0 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x - 1 && entity.y === splitter.y, //esquerda
    )?.id ?? null;
  let target0Entity = target0 ? state.entities.get(target0) : null;
  if (
    target0Entity &&
    ((target0Entity.type === "transport" &&
      target0Entity.entryDirection !== "right") ||
      (target0Entity.type === "stock" && target0Entity.direction !== "left") ||
      (target0Entity.type === "consumer" &&
        target0Entity.entryDirection !== "right") ||
      (target0Entity.type === "splitter" &&
        target0Entity.entryDirection !== "right") ||
      (target0Entity.type === "merger" &&
        target0Entity.leavingDirection === "right") ||
      target0Entity.type === "source")
  ) {
    target0Entity = null;
    target0 = null;
  }

  let target1 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y - 1, //cima
    )?.id ?? null;
  let target1Entity = target1 ? state.entities.get(target1) : null;
  if (
    target1Entity &&
    ((target1Entity.type === "transport" &&
      target1Entity.entryDirection !== "down") ||
      (target1Entity.type === "stock" && target1Entity.direction !== "up") ||
      (target1Entity.type === "consumer" &&
        target1Entity.entryDirection !== "down") ||
      (target1Entity.type === "splitter" &&
        target1Entity.entryDirection !== "down") ||
      (target1Entity.type === "merger" &&
        target1Entity.leavingDirection === "down") ||
      target1Entity.type === "source")
  ) {
    target1Entity = null;
    target1 = null;
  }

  let target2 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x + 1 && entity.y === splitter.y, //direita
    )?.id ?? null;
  let target2Entity = target2 ? state.entities.get(target2) : null;
  if (
    target2Entity &&
    ((target2Entity.type === "transport" &&
      target2Entity.entryDirection !== "left") ||
      (target2Entity.type === "stock" && target2Entity.direction !== "right") ||
      (target2Entity.type === "consumer" &&
        target2Entity.entryDirection !== "left") ||
      (target2Entity.type === "splitter" &&
        target2Entity.entryDirection !== "left") ||
      (target2Entity.type === "merger" &&
        target2Entity.leavingDirection === "left") ||
      target2Entity.type === "source")
  ) {
    target2Entity = null;
    target2 = null;
  }

  if (target0Entity) {
    if (target0Entity.type === "transport") {
      const transportEntity = target0Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "right"
    ) {
      switch (target0Entity.leavingDirection) {
        case "up": {
          target0Entity.source[0] = splitter.id;
          break;
        }
        case "down": {
          target0Entity.source[2] = splitter.id;
          break;
        }
        case "left": {
          target0Entity.source[1] = splitter.id;
          break;
        }
      }
    }
    if (target0Entity.type === "splitter") {
      target0Entity.source = splitter.id;
    }
    splitter.target[0] = target0;
  }
  if (target1Entity) {
    if (target1Entity.type === "transport") {
      const transportEntity = target1Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "down"
    ) {
      switch (target1Entity.leavingDirection) {
        case "right":
          target1Entity.source[0] = splitter.id;
          break;
        case "up":
          target1Entity.source[1] = splitter.id;
          break;
        case "left":
          target1Entity.source[2] = splitter.id;
          break;
      }
    }
    if (target1Entity.type === "splitter") {
      target1Entity.source = splitter.id;
    }
    splitter.target[1] = target1;
  }
  if (target2Entity) {
    if (target2Entity.type === "transport") {
      const transportEntity = target2Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "left"
    ) {
      const mergerEntity = target2Entity;
      switch (mergerEntity.leavingDirection) {
        case "up": {
          mergerEntity.source[2] = splitter.id;
          break;
        }
        case "right": {
          mergerEntity.source[1] = splitter.id;
          break;
        }
        case "down": {
          mergerEntity.source[0] = splitter.id;
          break;
        }
      }
    }
    if (target2Entity.type === "splitter") {
      target2Entity.source = splitter.id;
    }
    splitter.target[2] = target2;
  }
}

function updateSplitterLeftEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  let sourceID =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x - 1 && entity.y === splitter.y,
    )?.id ?? null;
  let sourceEntity = sourceID ? state.entities.get(sourceID) : null;
  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "right") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "right") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "right") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection == "right") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }
  if (sourceID) {
    splitter.source = sourceID;
  }
  if (sourceEntity) {
    if (
      sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection === "down"
    ) {
      const transportEntity = sourceEntity;
      transportEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "merger" &&
      sourceEntity.leavingDirection === "right"
    ) {
      const mergerEntity = sourceEntity;
      mergerEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "right"
    ) {
      switch (sourceEntity.entryDirection) {
        case "up": {
          sourceEntity.target[0] = splitter.id;
          break;
        }
        case "down": {
          sourceEntity.target[2] = splitter.id;
          break;
        }
        case "left": {
          sourceEntity.target[1] = splitter.id;
          break;
        }
      }
    }
  }
  //achar targets
  let target0 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y - 1, //cima
    )?.id ?? null;
  let target0Entity = target0 ? state.entities.get(target0) : null;
  if (
    target0Entity &&
    ((target0Entity.type === "transport" &&
      target0Entity.entryDirection !== "down") ||
      (target0Entity.type === "stock" && target0Entity.direction !== "up") ||
      (target0Entity.type === "consumer" &&
        target0Entity.entryDirection !== "down") ||
      (target0Entity.type === "splitter" &&
        target0Entity.entryDirection !== "down") ||
      (target0Entity.type === "merger" &&
        target0Entity.leavingDirection === "down") ||
      target0Entity.type === "source")
  ) {
    target0Entity = null;
    target0 = null;
  }

  let target1 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x + 1 && entity.y === splitter.y, //direita
    )?.id ?? null;
  let target1Entity = target1 ? state.entities.get(target1) : null;
  if (
    target1Entity &&
    ((target1Entity.type === "transport" &&
      target1Entity.entryDirection !== "left") ||
      (target1Entity.type === "stock" && target1Entity.direction !== "right") ||
      (target1Entity.type === "consumer" &&
        target1Entity.entryDirection !== "left") ||
      (target1Entity.type === "splitter" &&
        target1Entity.entryDirection !== "left") ||
      (target1Entity.type === "merger" &&
        target1Entity.leavingDirection === "left") ||
      target1Entity.type === "source")
  ) {
    target1Entity = null;
    target1 = null;
  }

  let target2 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y + 1, //baixo
    )?.id ?? null;
  let target2Entity = target2 ? state.entities.get(target2) : null;
  if (
    target2Entity &&
    ((target2Entity.type === "transport" &&
      target2Entity.entryDirection !== "up") ||
      (target2Entity.type === "stock" && target2Entity.direction !== "down") ||
      (target2Entity.type === "consumer" &&
        target2Entity.entryDirection !== "up") ||
      (target2Entity.type === "splitter" &&
        target2Entity.entryDirection !== "up") ||
      (target2Entity.type === "merger" &&
        target2Entity.leavingDirection === "up") ||
      target2Entity.type === "source")
  ) {
    target2Entity = null;
    target2 = null;
  }

  if (target0Entity) {
    if (target0Entity.type === "transport") {
      const transportEntity = target0Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "down"
    ) {
      switch (target0Entity.leavingDirection) {
        case "right":
          target0Entity.source[0] = splitter.id;
          break;
        case "up":
          target0Entity.source[1] = splitter.id;
          break;
        case "left":
          target0Entity.source[2] = splitter.id;
          break;
      }
    }
    if (target0Entity.type === "splitter") {
      target0Entity.source = splitter.id;
    }
    splitter.target[0] = target0;
  }
  if (target1Entity) {
    if (target1Entity.type === "transport") {
      const transportEntity = target1Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "left"
    ) {
      const mergerEntity = target1Entity;
      switch (mergerEntity.leavingDirection) {
        case "up": {
          mergerEntity.source[2] = splitter.id;
          break;
        }
        case "right": {
          mergerEntity.source[1] = splitter.id;
          break;
        }
        case "down": {
          mergerEntity.source[0] = splitter.id;
          break;
        }
      }
    }
    if (target1Entity.type === "splitter") {
      target1Entity.source = splitter.id;
    }
    splitter.target[1] = target1;
  }
  if (target2Entity) {
    if (target2Entity.type === "transport") {
      const transportEntity = target2Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "up"
    ) {
      switch (target2Entity.leavingDirection) {
        case "down": {
          target2Entity.source[1] = splitter.id;
          break;
        }
        case "left": {
          target2Entity.source[0] = splitter.id;
          break;
        }
        case "right": {
          target2Entity.source[2] = splitter.id;
          break;
        }
      }
    }
    if (target2Entity.type === "splitter") {
      target2Entity.source = splitter.id;
    }
    splitter.target[2] = target2;
  }
}

function updateSplitterRightEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  let sourceID =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x + 1 && entity.y === splitter.y,
    )?.id ?? null;
  let sourceEntity = sourceID ? state.entities.get(sourceID) : null;
  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "left") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "left") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "left") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection == "left") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }
  if (sourceID) {
    splitter.source = sourceID;
  }
  if (sourceEntity) {
    if (
      sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection === "down"
    ) {
      const transportEntity = sourceEntity;
      transportEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "merger" &&
      sourceEntity.leavingDirection === "left"
    ) {
      const mergerEntity = sourceEntity;
      mergerEntity.target = splitter.id;
    }
    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "left"
    ) {
      const rightSplitterEntity = sourceEntity;
      switch (rightSplitterEntity.entryDirection) {
        case "up": {
          rightSplitterEntity.target[2] = splitter.id;
          break;
        }
        case "down": {
          rightSplitterEntity.target[0] = splitter.id;
          break;
        }
        case "right": {
          rightSplitterEntity.target[1] = splitter.id;
          break;
        }
      }
    }
  }
  //achar targets
  let target0 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y + 1, //baixo
    )?.id ?? null;
  let target0Entity = target0 ? state.entities.get(target0) : null;
  if (
    target0Entity &&
    ((target0Entity.type === "transport" &&
      target0Entity.entryDirection !== "up") ||
      (target0Entity.type === "stock" && target0Entity.direction !== "down") ||
      (target0Entity.type === "consumer" &&
        target0Entity.entryDirection !== "up") ||
      (target0Entity.type === "splitter" &&
        target0Entity.entryDirection !== "up") ||
      (target0Entity.type === "merger" &&
        target0Entity.leavingDirection === "up") ||
      target0Entity.type === "source")
  ) {
    target0Entity = null;
    target0 = null;
  }

  let target1 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x - 1 && entity.y === splitter.y, //esquerda
    )?.id ?? null;
  let target1Entity = target1 ? state.entities.get(target1) : null;
  if (
    target1Entity &&
    ((target1Entity.type === "transport" &&
      target1Entity.entryDirection !== "right") ||
      (target1Entity.type === "stock" && target1Entity.direction !== "left") ||
      (target1Entity.type === "consumer" &&
        target1Entity.entryDirection !== "right") ||
      (target1Entity.type === "splitter" &&
        target1Entity.entryDirection !== "right") ||
      (target1Entity.type === "merger" &&
        target1Entity.leavingDirection === "right") ||
      target1Entity.type === "source")
  ) {
    target1Entity = null;
    target1 = null;
  }

  let target2 =
    Array.from(state.entities.values()).find(
      (entity) => entity.x === splitter.x && entity.y === splitter.y - 1, //cima
    )?.id ?? null;
  let target2Entity = target2 ? state.entities.get(target2) : null;
  if (
    target2Entity &&
    ((target2Entity.type === "transport" &&
      target2Entity.entryDirection !== "down") ||
      (target2Entity.type === "stock" && target2Entity.direction !== "up") ||
      (target2Entity.type === "consumer" &&
        target2Entity.entryDirection !== "down") ||
      (target2Entity.type === "splitter" &&
        target2Entity.entryDirection !== "down") ||
      (target2Entity.type === "merger" &&
        target2Entity.leavingDirection === "down") ||
      target2Entity.type === "source")
  ) {
    target2Entity = null;
    target2 = null;
  }

  if (target0Entity) {
    if (target0Entity.type === "transport") {
      const transportEntity = target0Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "up"
    ) {
      switch (target0Entity.leavingDirection) {
        case "down": {
          target0Entity.source[1] = splitter.id;
          break;
        }
        case "left": {
          target0Entity.source[0] = splitter.id;
          break;
        }
        case "right": {
          target0Entity.source[2] = splitter.id;
          break;
        }
      }
    }
    if (target0Entity.type === "splitter") {
      target0Entity.source = splitter.id;
    }
    splitter.target[0] = target0;
  }
  if (target1Entity) {
    if (target1Entity.type === "transport") {
      const transportEntity = target1Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "right"
    ) {
      switch (target1Entity.leavingDirection) {
        case "up": {
          target1Entity.source[0] = splitter.id;
          break;
        }
        case "down": {
          target1Entity.source[2] = splitter.id;
          break;
        }
        case "left": {
          target1Entity.source[1] = splitter.id;
          break;
        }
      }
    }
    if (target1Entity.type === "splitter") {
      target1Entity.source = splitter.id;
    }
    splitter.target[1] = target1;
  }
  if (target2Entity) {
    if (target2Entity.type === "transport") {
      const transportEntity = target2Entity;
      transportEntity.source = splitter.id;
    }
    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "down"
    ) {
      switch (target2Entity.leavingDirection) {
        case "right":
          target2Entity.source[0] = splitter.id;
          break;
        case "up":
          target2Entity.source[1] = splitter.id;
          break;
        case "left":
          target2Entity.source[2] = splitter.id;
          break;
      }
    }
    if (target2Entity.type === "splitter") {
      target2Entity.source = splitter.id;
    }
    splitter.target[2] = target2;
  }
}
