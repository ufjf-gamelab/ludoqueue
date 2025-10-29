import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { GameStatus, GameType } from "./types";
import type {
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
  createStock,
  deleteStock,
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
      return createStock(state, action.max, action.x, action.y);
    case "delete stock":
      return deleteStock(state, action.id);
    case "create consumer":
      return createConsumer(state, action.max, action.rate, action.x, action.y);
    case "delete consumer":
      return deleteConsumer(state, action.id);
    case "create transport":
      return createTransport(
        state,
        action.max,
        action.rate,
        action.source,
        action.target,
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
    gameTransportTick(transport, all);
  });
  sources.forEach((source) => {
    gameSourceTick(source);
  });
  consumers.forEach((consumer) => {
    gameConsumerTick(consumer);
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

export function gameTransportTick(
  transport: EntityTransportType,
  all: Map<string, EntityType>
) {
  transport.cooldown -= 1;
  if (transport.cooldown > 0) {
    return;
  }
  transport.cooldown += 1 / transport.rate;

  const source = all.get(transport.source!);
  const target = all.get(transport.target!);
  if (!source || !target) {
    return;
  }
  if (transport.val === 1 && target.val < target.max) {
    if (target.type == "stock" && target.closed) {
      return;
    }
    transport.val--;
    target.val++;
  } else if (transport.val === 0 && source.val > 0) {
    transport.val++;
    source.val--;
  }
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
export type GameAction =
  | GameActionCreateSource
  | GameActionDeleteSource
  | GameActionCreateStock
  | GameActionDeleteStock
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
      if (entity) return state;
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x - 1 &&
          e.y === y &&
          (e.type === "source" || e.type === "stock")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x + 1 &&
          e.y === y &&
          (e.type === "consumer" || e.type === "stock")
      );
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        source: source?.id,
        target: target?.id,
        x: x,
        y: y,
        direction: "right",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport down": {
      if (entity) return state;
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y - 1 &&
          (e.type === "source" || e.type === "stock")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y + 1 &&
          (e.type === "consumer" || e.type === "stock")
      );
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        source: source?.id,
        target: target?.id,
        x: x,
        y: y,
        direction: "down",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport left": {
      if (entity) return state;
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x + 1 &&
          e.y === y &&
          (e.type === "source" || e.type === "stock")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x - 1 &&
          e.y === y &&
          (e.type === "consumer" || e.type === "stock")
      );
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        source: source?.id,
        target: target?.id,
        x: x,
        y: y,
        direction: "left",
      };
      newState.status = "waiting";
      return gameReducer(newState, action);
    }
    case "transport up": {
      if (entity) return state;
      const source = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y + 1 &&
          (e.type === "source" || e.type === "stock")
      );
      const target = Array.from(state.entities.values()).find(
        (e) =>
          e.x === x &&
          e.y === y - 1 &&
          (e.type === "consumer" || e.type === "stock")
      );
      const action: GameActionCreateTransport = {
        type: "create transport",
        max: 1,
        rate: 1,
        source: source?.id,
        target: target?.id,
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
