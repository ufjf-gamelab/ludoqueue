import type { GameType } from "../../types";
import type {
  EntityTransportType,
  DirectionType,
  EntityType,
} from "../EntitiesTypes";

export type GameActionCreateTransport = {
  type: "create transport";
  rate: number;
  max: number;
  x: number;
  y: number;
  direction: DirectionType;
};

export type GameActionDeleteTransport = {
  type: "delete transport";
  id: string;
};

export function createTransport(
  state: GameType,
  max: number,
  rate: number,
  x: number,
  y: number,
  direction: DirectionType
) {
  if (
    Array.from(state.entities.values()).find(
      (entity) => entity.x === x && entity.y === y
    )
  ) {
    //checagem se ja existe entidade na posicao
    return state;
  }
  //determina ID do transport
  let numberID: number = 1;
  if (state.transports.length > 0) {
    const lastTransportNumber = state.transports
      .map((transportId) => parseInt(transportId.replace("transport", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastTransportNumber + 1;
  }

  const newState = structuredClone(state);
  const newTransportID: string = "transport" + numberID;
  const newTransportEntity: EntityTransportType = {
    id: newTransportID,
    name: "Transport " + numberID,
    type: "transport",
    val: 0,
    max: max,
    rate: rate,
    cooldown: 1,
    source: null,
    target: null,
    x,
    y,
    direction,
    movingGoods: [],
  };
  newState.entities.set(newTransportID, newTransportEntity);
  newState.transports.push(newTransportID);
  updateConnections(newState, newTransportEntity);
  return newState;
}

export function deleteTransport(state: GameType, transport: string) {
  const transportIndex = state.transports.indexOf(transport); //pelo createTransport ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (transportIndex !== -1) {
    const newState = structuredClone(state);
    newState.transports.splice(transportIndex);
    newState.entities.delete(transport);
    return newState;
  }
  return state;
}

export function updateConnections(
  state: GameType,
  entityToUpdate: EntityType
) {
  updateLeftConnections(entityToUpdate, state);
  updateRightConnections(entityToUpdate, state);
  updateUpperConnections(entityToUpdate, state);
  updateLowerConnections(entityToUpdate, state);
}

function updateLeftConnections(entityToUpdate: EntityType, state: GameType) {
  const leftEntity = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x - 1 && entity.y === entityToUpdate.y
  );

  if (!leftEntity) {
    return;
  }
  if (
    leftEntity.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (leftEntity.direction) {
      case "left": {
        leftEntity.source = entityToUpdate.id;
        break;
      }
      case "right": {
        leftEntity.target = entityToUpdate.id;
        break;
      }
    }
    switch (entityToUpdate.direction) {
      case "left": {
        entityToUpdate.target = leftEntity.id;
        break;
      }
      case "right": {
        entityToUpdate.source = leftEntity.id;
        break;
      }
    }
  } else if (leftEntity.type === "transport") {
    switch (leftEntity.direction) {
      case "left": {
        if (entityToUpdate.type == "consumer" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "left") {
          leftEntity.source = entityToUpdate.id;
        }
        break;
      }
      case "right": {
        if (entityToUpdate.type === "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "left") {
          leftEntity.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "right": {
        if (leftEntity.type == "consumer") {
          break;
        }
        if (leftEntity.leavingDirection === "right") {
          entityToUpdate.source = leftEntity.id;
        }
        break;
      }
      case "left": {
        if (leftEntity.type == "source") {
          break;
        }
        if (leftEntity.entryDirection === "right") {
          entityToUpdate.target = leftEntity.id;
        }
        break;
      }
    }
  }
}

function updateRightConnections(entityToUpdate: EntityType, state: GameType) {
  const rightEntity = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x + 1 && entity.y === entityToUpdate.y
  );

  if (!rightEntity) {
    return;
  }
  if (
    rightEntity.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (rightEntity.direction) {
      case "left": {
        rightEntity.target = entityToUpdate.id;
        break;
      }
      case "right": {
        rightEntity.source = entityToUpdate.id;
        break;
      }
    }
    switch (entityToUpdate.direction) {
      case "left": {
        entityToUpdate.source = rightEntity.id;
        break;
      }
      case "right": {
        entityToUpdate.target = rightEntity.id;
        break;
      }
    }
  } else if (rightEntity.type === "transport") {
    switch (rightEntity.direction) {
      case "right": {
        if (entityToUpdate.type == "consumer"  || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "right") {
          rightEntity.source = entityToUpdate.id;
        }
        break;
      }
      case "left": {
        if (entityToUpdate.type == "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "right") {
          rightEntity.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "left": {
        if (rightEntity.type == "consumer") {
          break;
        }
        if (rightEntity.leavingDirection === "left") {
          entityToUpdate.source = rightEntity.id;
        }
        break;
      }
      case "right": {
        if (rightEntity.type == "source") {
          break;
        }
        if (rightEntity.entryDirection === "left") {
          entityToUpdate.target = rightEntity.id;
        }
        break;
      }
    }
  }
}

function updateUpperConnections(entityToUpdate: EntityType, state: GameType) {
  const upperEntity = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x && entity.y === entityToUpdate.y - 1
  );

  if (!upperEntity) {
    return;
  }

  if (
    upperEntity.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (upperEntity.direction) {
      case "up": {
        upperEntity.source = entityToUpdate.id;
        break;
      }
      case "down": {
        upperEntity.target = entityToUpdate.id;
        break;
      }
    }
    switch (entityToUpdate.direction) {
      case "up": {
        entityToUpdate.target = upperEntity.id;
        break;
      }
      case "down": {
        entityToUpdate.source = upperEntity.id;
        break;
      }
    }
  } else if (upperEntity.type === "transport") {
    switch (upperEntity.direction) {
      case "up": {
        if (entityToUpdate.type == "consumer"  || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "up") {
          upperEntity.source = entityToUpdate.id;
        }
        break;
      }
      case "down": {
        if (entityToUpdate.type == "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "up") {
          upperEntity.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "down": {
        if (upperEntity.type == "consumer") {
          break;
        }
        if (upperEntity.leavingDirection === "down") {
          entityToUpdate.source = upperEntity.id;
        }
        break;
      }
      case "up": {
        if (upperEntity.type == "source") {
          break;
        }
        if (upperEntity.entryDirection === "down") {
          entityToUpdate.target = upperEntity.id;
        }
        break;
      }
    }
  }
}

function updateLowerConnections(entityToUpdate: EntityType, state: GameType) {
  const lowerEntity = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x && entity.y === entityToUpdate.y + 1
  );

  if (!lowerEntity) {
    return;
  }

  if (
    lowerEntity.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (lowerEntity.direction) {
      case "up": {
        lowerEntity.target = entityToUpdate.id;
        break;
      }
      case "down": {
        lowerEntity.source = entityToUpdate.id;
        break;
      }
    }
    switch (entityToUpdate.direction) {
      case "up": {
        entityToUpdate.source = lowerEntity.id;
        break;
      }
      case "down": {
        entityToUpdate.target = lowerEntity.id;
        break;
      }
    }
  } else if (lowerEntity.type === "transport") {
    switch (lowerEntity.direction) {
      case "down": {
        if (entityToUpdate.type == "consumer"  || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "down") {
          lowerEntity.source = entityToUpdate.id;
        }
        break;
      }
      case "up": {
        if (entityToUpdate.type == "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "down") {
          lowerEntity.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "up": {
        if (lowerEntity.type == "consumer") {
          break;
        }
        if (lowerEntity.leavingDirection === "up") {
          entityToUpdate.source = lowerEntity.id;
        }
        break;
      }
      case "down": {
        if (lowerEntity.type == "source") {
          break;
        }
        if (lowerEntity.entryDirection === "up") {
          entityToUpdate.target = lowerEntity.id;
        }
        break;
      }
    }
  }
}
