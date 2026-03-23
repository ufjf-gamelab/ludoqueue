import type { GameType } from "../../types";
import type { DirectionType, EntitySplitterType } from "../EntitiesTypes";
import {
  clearConnectionsToEntity,
  getEntityAt,
  tryToConnectSource,
  tryToConnectTarget,
} from "../EntityCreationActions";

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
    targets: [],
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
    const splitterEntity = newState.entities.get(
      newState.splitters[splitterIndex],
    );
    clearConnectionsToEntity(newState, splitterEntity!);
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
  splitter.targets = [];
  clearConnectionsToEntity(state, splitter);
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
  let sourceEntity = getEntityAt(state, splitter.x, splitter.y - 1);
  let sourceID = sourceEntity?.id ?? null;

  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "down") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "down") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "down") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection === "down") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }

  if (sourceID) {
    splitter.source = sourceID;
  }

  if (sourceEntity) {
    tryToConnectTarget(sourceEntity, "down", splitter.id);

    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "down"
    ) {
      switch (sourceEntity.entryDirection) {
        case "up":
          sourceEntity.targets[1] = splitter.id;
          break;
        case "left":
          sourceEntity.targets[2] = splitter.id;
          break;
        case "right":
          sourceEntity.targets[0] = splitter.id;
          break;
      }
    }
  }

  let target0Entity = getEntityAt(state, splitter.x + 1, splitter.y);
  let target0 = target0Entity?.id ?? null;

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

  let target1Entity = getEntityAt(state, splitter.x, splitter.y + 1);
  let target1 = target1Entity?.id ?? null;

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

  let target2Entity = getEntityAt(state, splitter.x - 1, splitter.y);
  let target2 = target2Entity?.id ?? null;

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
    tryToConnectSource(target0Entity, "left", splitter.id);
    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "left"
    ) {
      switch (target0Entity.leavingDirection) {
        case "up":
          target0Entity.sources[2] = splitter.id;
          break;
        case "right":
          target0Entity.sources[1] = splitter.id;
          break;
        case "down":
          target0Entity.sources[0] = splitter.id;
          break;
      }
    }
    splitter.targets[0] = target0;
  }

  if (target1Entity) {
    tryToConnectSource(target1Entity, "up", splitter.id);
    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "up"
    ) {
      switch (target1Entity.leavingDirection) {
        case "down":
          target1Entity.sources[1] = splitter.id;
          break;
        case "left":
          target1Entity.sources[0] = splitter.id;
          break;
        case "right":
          target1Entity.sources[2] = splitter.id;
          break;
      }
    }
    splitter.targets[1] = target1;
  }

  if (target2Entity) {
    tryToConnectSource(target2Entity, "right", splitter.id);
    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "right"
    ) {
      switch (target2Entity.leavingDirection) {
        case "up":
          target2Entity.sources[0] = splitter.id;
          break;
        case "down":
          target2Entity.sources[2] = splitter.id;
          break;
        case "left":
          target2Entity.sources[1] = splitter.id;
          break;
      }
    }
    splitter.targets[2] = target2;
  }
}

function updateSplitterDownEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  // SOURCE (DOWN)
  let sourceEntity = getEntityAt(state, splitter.x, splitter.y + 1);
  let sourceID = sourceEntity?.id ?? null;

  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "up") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "up") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "up") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection === "up") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }

  if (sourceID) {
    splitter.sources = sourceID;
  }

  if (sourceEntity) {
    tryToConnectTarget(sourceEntity, "up", splitter.id);

    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "up"
    ) {
      switch (sourceEntity.entryDirection) {
        case "down":
          sourceEntity.targets[1] = splitter.id;
          break;
        case "left":
          sourceEntity.targets[0] = splitter.id;
          break;
        case "right":
          sourceEntity.targets[2] = splitter.id;
          break;
      }
    }
  }

  // TARGET LEFT
  let target0Entity = getEntityAt(state, splitter.x - 1, splitter.y);
  let target0 = target0Entity?.id ?? null;

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

  // TARGET UP
  let target1Entity = getEntityAt(state, splitter.x, splitter.y - 1);
  let target1 = target1Entity?.id ?? null;

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

  // TARGET RIGHT
  let target2Entity = getEntityAt(state, splitter.x + 1, splitter.y);
  let target2 = target2Entity?.id ?? null;

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
    tryToConnectSource(target0Entity, "right", splitter.id);

    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "right"
    ) {
      switch (target0Entity.leavingDirection) {
        case "up":
          target0Entity.sources[0] = splitter.id;
          break;
        case "down":
          target0Entity.sources[2] = splitter.id;
          break;
        case "left":
          target0Entity.sources[1] = splitter.id;
          break;
      }
    }

    splitter.targets[0] = target0;
  }

  if (target1Entity) {
    tryToConnectSource(target1Entity, "down", splitter.id);

    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "down"
    ) {
      switch (target1Entity.leavingDirection) {
        case "right":
          target1Entity.sources[0] = splitter.id;
          break;
        case "up":
          target1Entity.sources[1] = splitter.id;
          break;
        case "left":
          target1Entity.sources[2] = splitter.id;
          break;
      }
    }

    splitter.targets[1] = target1;
  }

  if (target2Entity) {
    tryToConnectSource(target2Entity, "left", splitter.id);

    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "left"
    ) {
      switch (target2Entity.leavingDirection) {
        case "up":
          target2Entity.sources[2] = splitter.id;
          break;
        case "right":
          target2Entity.sources[1] = splitter.id;
          break;
        case "down":
          target2Entity.sources[0] = splitter.id;
          break;
      }
    }

    splitter.targets[2] = target2;
  }
}

function updateSplitterLeftEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  // SOURCE (LEFT)
  let sourceEntity = getEntityAt(state, splitter.x - 1, splitter.y);
  let sourceID = sourceEntity?.id ?? null;

  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "right") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "right") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "right") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection === "right") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }

  if (sourceID) {
    splitter.sources = sourceID;
  }

  if (sourceEntity) {
    tryToConnectTarget(sourceEntity, "right", splitter.id);

    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "right"
    ) {
      switch (sourceEntity.entryDirection) {
        case "up":
          sourceEntity.targets[0] = splitter.id;
          break;
        case "down":
          sourceEntity.targets[2] = splitter.id;
          break;
        case "left":
          sourceEntity.targets[1] = splitter.id;
          break;
      }
    }
  }

  // TARGET UP
  let target0Entity = getEntityAt(state, splitter.x, splitter.y - 1);
  let target0 = target0Entity?.id ?? null;

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

  // TARGET RIGHT
  let target1Entity = getEntityAt(state, splitter.x + 1, splitter.y);
  let target1 = target1Entity?.id ?? null;

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

  // TARGET DOWN
  let target2Entity = getEntityAt(state, splitter.x, splitter.y + 1);
  let target2 = target2Entity?.id ?? null;

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
    tryToConnectSource(target0Entity, "down", splitter.id);

    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "down"
    ) {
      switch (target0Entity.leavingDirection) {
        case "right":
          target0Entity.sources[0] = splitter.id;
          break;
        case "up":
          target0Entity.sources[1] = splitter.id;
          break;
        case "left":
          target0Entity.sources[2] = splitter.id;
          break;
      }
    }

    splitter.targets[0] = target0;
  }

  if (target1Entity) {
    tryToConnectSource(target1Entity, "left", splitter.id);

    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "left"
    ) {
      switch (target1Entity.leavingDirection) {
        case "up":
          target1Entity.sources[2] = splitter.id;
          break;
        case "right":
          target1Entity.sources[1] = splitter.id;
          break;
        case "down":
          target1Entity.sources[0] = splitter.id;
          break;
      }
    }

    splitter.targets[1] = target1;
  }

  if (target2Entity) {
    tryToConnectSource(target2Entity, "up", splitter.id);

    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "up"
    ) {
      switch (target2Entity.leavingDirection) {
        case "down":
          target2Entity.sources[1] = splitter.id;
          break;
        case "left":
          target2Entity.sources[0] = splitter.id;
          break;
        case "right":
          target2Entity.sources[2] = splitter.id;
          break;
      }
    }

    splitter.targets[2] = target2;
  }
}

function updateSplitterRightEntry(
  state: GameType,
  splitter: EntitySplitterType,
) {
  // SOURCE (RIGHT)
  let sourceEntity = getEntityAt(state, splitter.x + 1, splitter.y);
  let sourceID = sourceEntity?.id ?? null;

  if (
    sourceEntity &&
    ((sourceEntity.type === "transport" &&
      sourceEntity.leavingDirection !== "left") ||
      (sourceEntity.type === "stock" && sourceEntity.direction !== "left") ||
      (sourceEntity.type === "source" &&
        sourceEntity.leavingDirection !== "left") ||
      (sourceEntity.type === "splitter" &&
        sourceEntity.entryDirection === "left") ||
      sourceEntity.type === "consumer")
  ) {
    sourceEntity = null;
    sourceID = null;
  }

  if (sourceID) {
    splitter.source = sourceID;
  }

  if (sourceEntity) {
    tryToConnectTarget(sourceEntity, "left", splitter.id);

    if (
      sourceEntity.type === "splitter" &&
      sourceEntity.entryDirection !== "left"
    ) {
      switch (sourceEntity.entryDirection) {
        case "up":
          sourceEntity.targets[2] = splitter.id;
          break;
        case "down":
          sourceEntity.targets[0] = splitter.id;
          break;
        case "right":
          sourceEntity.targets[1] = splitter.id;
          break;
      }
    }
  }

  // TARGET DOWN
  let target0Entity = getEntityAt(state, splitter.x, splitter.y + 1);
  let target0 = target0Entity?.id ?? null;

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

  // TARGET LEFT
  let target1Entity = getEntityAt(state, splitter.x - 1, splitter.y);
  let target1 = target1Entity?.id ?? null;

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

  // TARGET UP
  let target2Entity = getEntityAt(state, splitter.x, splitter.y - 1);
  let target2 = target2Entity?.id ?? null;

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
    tryToConnectSource(target0Entity, "up", splitter.id);

    if (
      target0Entity.type === "merger" &&
      target0Entity.leavingDirection !== "up"
    ) {
      switch (target0Entity.leavingDirection) {
        case "down":
          target0Entity.sources[1] = splitter.id;
          break;
        case "left":
          target0Entity.sources[0] = splitter.id;
          break;
        case "right":
          target0Entity.sources[2] = splitter.id;
          break;
      }
    }

    splitter.targets[0] = target0;
  }

  if (target1Entity) {
    tryToConnectSource(target1Entity, "right", splitter.id);

    if (
      target1Entity.type === "merger" &&
      target1Entity.leavingDirection !== "right"
    ) {
      switch (target1Entity.leavingDirection) {
        case "up":
          target1Entity.sources[0] = splitter.id;
          break;
        case "down":
          target1Entity.sources[2] = splitter.id;
          break;
        case "left":
          target1Entity.sources[1] = splitter.id;
          break;
      }
    }

    splitter.targets[1] = target1;
  }

  if (target2Entity) {
    tryToConnectSource(target2Entity, "down", splitter.id);

    if (
      target2Entity.type === "merger" &&
      target2Entity.leavingDirection !== "down"
    ) {
      switch (target2Entity.leavingDirection) {
        case "right":
          target2Entity.sources[0] = splitter.id;
          break;
        case "up":
          target2Entity.sources[1] = splitter.id;
          break;
        case "left":
          target2Entity.sources[2] = splitter.id;
          break;
      }
    }

    splitter.targets[2] = target2;
  }
}

export function updateSplitterArray(
  state: GameType,
  entity: EntitySplitterType,
) {
  switch (entity.entryDirection) {
    case "up":
  }
}
