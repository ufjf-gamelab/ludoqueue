import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { GameStatus, GameType } from "./types";
import type {
  DirectionType,
  EntityConsumerType,
  EntitySourceType,
  EntityStockType,
  EntityTransportType,
  EntityType,
} from "./entities/EntitiesTypes";
import { initialState } from "./data";
import {
  createSource,
  deleteSource,
  type GameActionCreateSource,
  type GameActionDeleteSource,
} from "./entities/Source/SourceActions";
import {
  changeStockDirection,
  createStock,
  deleteStock,
  type GameActionChangeStockDirection,
  type GameActionCreateStock,
  type GameActionDeleteStock,
} from "./entities/Stock/StockActions";
import {
  createConsumer,
  deleteConsumer,
  type GameActionCreateConsumer,
  type GameActionDeleteConsumer,
} from "./entities/Consumer/ConsumerActions";
import {
  createTransport,
  deleteTransport,
  updateConnections,
  type GameActionCreateTransport,
  type GameActionDeleteTransport,
} from "./entities/Transport/TransportActions";
type GameProviderProps = {
  children: ReactNode;
};
const GameContext = createContext<{
  game: GameType;
  dispatch: Dispatch<GameAction>;
} | null>(null);
export default function GameProvider({ children }: GameProviderProps) {
  const [game, dispatch] = useReducer(gameReducer, initialState);
  return <GameContext value={{ game, dispatch }}>{children}</GameContext>;
}
export function useGame() {
  return useContext(GameContext);
}

export function gameReducer(state: GameType, action: GameAction): GameType {
  switch (action.type) {
    case "create source":
      return createSource(state, action.max, action.x, action.y);
    case "delete source":
      return deleteSource(state, action.id);
    case "create stock":
      return createStock(state, action.max, action.x, action.y, action.direction);
    case "delete stock":
      return deleteStock(state, action.id);
    case "change stock direction":
      return changeStockDirection(state, action.id, action.direction);
    case "change leaving direction":
      return changeLeavingDirection(state, action.id, action.direction);
    case "change entering direction":
      return changeEnteringDirection(state, action.id, action.direction);
    case "create consumer":
      return createConsumer(state, action.max, action.rate, action.x, action.y);
    case "delete consumer":
      return deleteConsumer(state, action.id);
    case "create transport":
      return createTransport(
        state,
        action.max,
        action.rate,
        action.x,
        action.y,
        action.direction
      );
    case "delete transport":
      return deleteTransport(state, action.id);
    case "set node value":
      return setNodeVal(state, action.id, action.value);
    case "game tick":
      return gameTick(state);
    case "select entity":
      return selectEntity(state, action.entityId);
    case "set status": {
      if (state.status === action.newStatus) {
        return { ...state, status: "waiting" };
      } else {
        return { ...state, status: action.newStatus };
      }
    }
    case "pointing":
      return pointingAction(state, action);

    default:
      break;
  }
  return state;
}

function setNodeVal(state: GameType, nodeID: string, value: number) {
  const newState = structuredClone(state);
  const node = newState.entities.get(nodeID);
  if (!node) {
    return state;
  }
  node.val = value;
  return newState;
}

export function gameTick(state: GameType) {
  const sources = new Map<string, EntitySourceType>();
  const consumers = new Map<string, EntityConsumerType>();
  const transports = new Map<string, EntityTransportType>();
  const stocks = new Map<string, EntityStockType>();

  const newState = structuredClone(state);
  for (const [, node] of newState.entities.entries()) {
    switch (node.type) {
      case "source": {
        sources.set(node.id, node);
        break;
      }
      case "consumer": {
        consumers.set(node.id, node);
        break;
      }
      case "transport": {
        transports.set(node.id, node);
        break;
      }
      case "stock": {
        stocks.set(node.id, node);
        break;
      }
    }
  }
  const all = new Map<string, EntityType>([
    ...sources.entries(),
    ...consumers.entries(),
    ...transports.entries(),
    ...stocks.entries(),
  ]);

  transports.forEach((transport) => {
    calculatePendingMovingGoods(transport, all);
  });
  transports.forEach((transport) => {
    transportMovingGoods(transport);
  });
  consumers.forEach((consumer) => {
    gameConsumerTick(consumer);
  });
  sources.forEach((source) => {
    gameSourceTick(source);
  });
  return newState;
}

export function gameSourceTick(node: EntitySourceType) {
  node.cooldown -= 1;
  if (node.cooldown > 0) {
    return;
  }

  if (node.val < node.max) {
    node.val += node.rate;
  }
  node.cooldown += 1 / node.rate;
}

export function gameConsumerTick(node: EntityConsumerType) {
  node.cooldown -= 1;
  if (node.cooldown > 0) {
    return;
  }
  if (node.val > 0) {
    node.val--;
  }
  node.cooldown += 1 / node.rate;
}

export function calculatePendingMovingGoods(
  transport: EntityTransportType,
  all: Map<string, EntityType>
) {
  transport.movingGoods = [];
  transport.cooldown -= 1;
  if (transport.cooldown > 0) {
    return transport.movingGoods;
  }
  transport.cooldown += 1 / transport.rate;

  const source = all.get(transport.source!);
  const target = all.get(transport.target!);
  if (target && transport.val === 1 && target.val < target.max) {
    if (target.type == "stock" && target.closed) {
      return transport.movingGoods;
    }
    transport.movingGoods.push({ source: transport, target, val: 1 });
  }
  if (source && transport.val === 0 && source.val > 0) {
    transport.movingGoods.push({ source, target: transport, val: 1 });
  }
  return transport.movingGoods;
}

export function transportMovingGoods(transport: EntityTransportType) {
  transport.movingGoods.forEach((movingGood) => {
    const source = movingGood.source;
    const target = movingGood.target;
    if (source && source.val > 0) {
      source.val -= movingGood.val;
    }
    if (target && target.val < target.max) {
      target.val += movingGood.val;
    }
  });
}

export function selectEntity(state: GameType, entityId: string | null) {
  const newState = structuredClone(state);
  newState.selected = entityId ? newState.entities.get(entityId) || null : null;
  return newState;
}

type GameActionSetNodeValue = {
  type: "set node value";
  id: string;
  value: number;
};

type GameActionTick = {
  type: "game tick";
};

type GameActionSelectEntity = {
  type: "select entity";
  entityId: string | null;
};

type GameActionSetStatus = {
  type: "set status";
  newStatus: GameStatus;
};

type GameActionPointing = {
  type: "pointing";
  x: number;
  y: number;
};

type GameActionChangeLeavingDirection = {
  type: "change leaving direction";
  id: string;
  direction: DirectionType;
};

type GameActionChangeEnteringDirection = {
  type: "change entering direction";
  id: string;
  direction: DirectionType;
};

export type GameAction =
  | GameActionCreateSource
  | GameActionDeleteSource
  | GameActionCreateStock
  | GameActionDeleteStock
  | GameActionChangeStockDirection
  | GameActionChangeLeavingDirection
  | GameActionChangeEnteringDirection
  | GameActionCreateConsumer
  | GameActionDeleteConsumer
  | GameActionCreateTransport
  | GameActionDeleteTransport
  | GameActionSetNodeValue
  | GameActionTick
  | GameActionSelectEntity
  | GameActionSetStatus
  | GameActionPointing;

export function pointingAction(
  state: GameType,
  action: GameActionPointing
): GameType {
  const { x, y } = action;
  const newState = structuredClone(state);
  const entity = Array.from(state.entities.values()).find(
    (e) => e.x === x && e.y === y
  );
  switch (state.status) {
    case "stock": {
      if (entity) return state;
      const action: GameActionCreateStock = {
        type: "create stock",
        max: 5,
        val: 0,
        x: x,
        y: y,
        direction: "right",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "source": {
      if (entity) return state;
      const action: GameActionCreateSource = {
        type: "create source",
        max: 5,
        val: 0,
        x: x,
        y: y,
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "consumer": {
      if (entity) return state;
      const action: GameActionCreateConsumer = {
        type: "create consumer",
        max: 5,
        rate: 1,
        x: x,
        y: y,
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport right": {
      if (entity) return state; /*
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x - 1 &&
          e.y === y &&
          (e.type === "source" || e.type === "stock" || e.type === "transport")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x + 1 &&
          e.y === y &&
          (e.type === "consumer" ||
            e.type === "stock" ||
            e.type === "transport")
      );*/
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        x: x,
        y: y,
        direction: "right",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport down": {
      if (entity) return state; /*
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y - 1 &&
          (e.type === "source" || e.type === "stock" || e.type === "transport")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y + 1 &&
          (e.type === "consumer" ||
            e.type === "stock" ||
            e.type === "transport")
      );*/
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        x: x,
        y: y,
        direction: "down",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport left": {
      if (entity) return state; /*
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x + 1 &&
          e.y === y &&
          (e.type === "source" || e.type === "stock" || e.type === "transport")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x - 1 &&
          e.y === y &&
          (e.type === "consumer" ||
            e.type === "stock" ||
            e.type === "transport")
      );*/
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        x: x,
        y: y,
        direction: "left",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport up": {
      if (entity) return state; /*
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y + 1 &&
          (e.type === "source" || e.type === "stock" || e.type === "transport")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y - 1 &&
          (e.type === "consumer" ||
            e.type === "stock" ||
            e.type === "transport")
      );*/
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        x: x,
        y: y,
        direction: "up",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }

    default:
      return state;
  }
  return state;
}


export function changeLeavingDirection(state: GameType, entityId: string, direction: DirectionType) {
  const entity = state.entities.get(entityId) as EntityType;
  if (entity.type === "stock"){
    return state;
  }
  if (entity.type != "source" && entity.entryDirection === direction) {
    return state;
  }
  if (entity && (entity.type === "stock" || entity.type === "source") ) {
    const newState = structuredClone(state);
    const newEntity = newState.entities.get(entityId) as EntityType;
    if (newEntity.type !== "stock" && newEntity.type !== "source") {
      return state;
    }
    newEntity.leavingDirection = direction;
    updateConnections(newState, newEntity);
    return newState;
  }
  return state;
} 

export function changeEnteringDirection(state: GameType, entityId: string, direction: DirectionType) {
  const entity = state.entities.get(entityId) as EntityType;
  if (entity.type === "stock"){
    return state;
  }
  if (entity.type != "consumer" && entity.leavingDirection === direction) {
    return state;
  }
  if (entity && entity.type === "consumer") {
    const newState = structuredClone(state);
    const newEntity = newState.entities.get(entityId) as EntityType;
    if (newEntity.type !== "stock" && newEntity.type !== "consumer") {
      return state;
    }
    newEntity.entryDirection = direction;
    updateConnections(newState, newEntity);
    return newState;
  }
  return state;
}
