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
  const entityToConnect = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x - 1 && entity.y === entityToUpdate.y
  );

  if (!entityToConnect) {
    return;
  }

  if (
    entityToConnect.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (entityToConnect.direction) {
      case "left": {
        entityToConnect.source = entityToUpdate.id;
        break;
      }
      case "right": {
        entityToConnect.target = entityToUpdate.id;
        break;
      }
    }
  } else if (entityToConnect.type === "transport") {
    switch (entityToConnect.direction) {
      case "left": {
        if (entityToUpdate.type == "consumer" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "left") {
          entityToConnect.source = entityToUpdate.id;
        }
        break;
      }
      case "right": {
        if (entityToUpdate.type === "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "left") {
          entityToConnect.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "left": {
        if (entityToConnect.type == "consumer") {
          break;
        }
        if (entityToConnect.leavingDirection === "left") {
          entityToUpdate.source = entityToConnect.id;
        }
        break;
      }
      case "right": {
        if (entityToConnect.type == "source") {
          break;
        }
        if (entityToConnect.entryDirection === "left") {
          entityToUpdate.target = entityToConnect.id;
        }
        break;
      }
    }
  }
}

function updateRightConnections(entityToUpdate: EntityType, state: GameType) {
  const entityToConnect = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x + 1 && entity.y === entityToUpdate.y
  );

  if (!entityToConnect) {
    return;
  }

  if (
    entityToConnect.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (entityToConnect.direction) {
      case "left": {
        entityToConnect.target = entityToUpdate.id;
        break;
      }
      case "right": {
        entityToConnect.source = entityToUpdate.id;
        break;
      }
    }
  } else if (entityToConnect.type === "transport") {
    switch (entityToConnect.direction) {
      case "right": {
        if (entityToUpdate.type == "consumer"  || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "right") {
          entityToConnect.source = entityToUpdate.id;
        }
        break;
      }
      case "left": {
        if (entityToUpdate.type == "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "right") {
          entityToConnect.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "right": {
        if (entityToConnect.type == "consumer") {
          break;
        }
        if (entityToConnect.leavingDirection === "right") {
          entityToUpdate.source = entityToConnect.id;
        }
        break;
      }
      case "left": {
        if (entityToConnect.type == "source") {
          break;
        }
        if (entityToConnect.entryDirection === "right") {
          entityToUpdate.target = entityToConnect.id;
        }
        break;
      }
    }
  }
}

function updateUpperConnections(entityToUpdate: EntityType, state: GameType) {
  const entityToConnect = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x && entity.y === entityToUpdate.y - 1
  );

  if (!entityToConnect) {
    return;
  }

  if (
    entityToConnect.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (entityToConnect.direction) {
      case "down": {
        entityToConnect.target = entityToUpdate.id;
        break;
      }
      case "up": {
        entityToConnect.source = entityToUpdate.id;
        break;
      }
    }
  } else if (entityToConnect.type === "transport") {
    switch (entityToConnect.direction) {
      case "up": {
        if (entityToUpdate.type == "consumer"  || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "up") {
          entityToConnect.source = entityToUpdate.id;
        }
        break;
      }
      case "down": {
        if (entityToUpdate.type == "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "up") {
          entityToConnect.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "up": {
        if (entityToConnect.type == "consumer") {
          break;
        }
        if (entityToConnect.leavingDirection === "up") {
          entityToUpdate.source = entityToConnect.id;
        }
        break;
      }
      case "down": {
        if (entityToConnect.type == "source") {
          break;
        }
        if (entityToConnect.entryDirection === "up") {
          entityToUpdate.target = entityToConnect.id;
        }
        break;
      }
    }
  }
}

function updateLowerConnections(entityToUpdate: EntityType, state: GameType) {
  const entityToConnect = Array.from(state.entities.values()).find(
    (entity) =>
      entity.x === entityToUpdate.x && entity.y === entityToUpdate.y + 1
  );

  if (!entityToConnect) {
    return;
  }

  if (
    entityToConnect.type === "transport" &&
    entityToUpdate.type === "transport"
  ) {
    switch (entityToConnect.direction) {
      case "down": {
        entityToConnect.target = entityToUpdate.id;
        break;
      }
      case "up": {
        entityToConnect.source = entityToUpdate.id;
        break;
      }
    }
  } else if (entityToConnect.type === "transport") {
    switch (entityToConnect.direction) {
      case "up": {
        if (entityToUpdate.type == "consumer"  || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.leavingDirection === "up") {
          entityToConnect.source = entityToUpdate.id;
        }
        break;
      }
      case "down": {
        if (entityToUpdate.type == "source" || entityToUpdate.type === "transport") {
          break;
        }
        if (entityToUpdate.entryDirection === "up") {
          entityToConnect.target = entityToUpdate.id;
        }
        break;
      }
    }
  } else if (entityToUpdate.type === "transport") {
    switch (entityToUpdate.direction) {
      case "up": {
        if (entityToConnect.type == "consumer") {
          break;
        }
        if (entityToConnect.leavingDirection === "up") {
          entityToUpdate.source = entityToConnect.id;
        }
        break;
      }
      case "down": {
        if (entityToConnect.type == "source") {
          break;
        }
        if (entityToConnect.entryDirection === "up") {
          entityToUpdate.target = entityToConnect.id;
        }
        break;
      }
    }
  }
}
