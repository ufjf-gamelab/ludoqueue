import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type {
  GameType,
} from "./types";
import type {
  EntityConsumerType,
  EntitySourceType,
  EntityStockType,
  EntityTransportType,
  EntityType,
} from "./entities/EntitiesTypes"
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
import { createConsumer, deleteConsumer, type GameActionCreateConsumer, type GameActionDeleteConsumer } from "./entities/Consumer/ConsumerActions";
import { createTransport, deleteTransport, type GameActionCreateTransport, type GameActionDeleteTransport } from "./entities/Transport/TransportActions";
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
      return createSource(state, action.max, action.posI, action.posJ);
    case "delete source":
      return deleteSource(state, action.id);
    case "create stock":
      return createStock(state, action.max, action.posI, action.posJ);
    case "delete stock":
      return deleteStock(state, action.id);
    case "create consumer":
      return createConsumer(state, action.max, action.rate, action.posI, action.posJ);
    case "delete consumer":
      return deleteConsumer(state, action.id);
    case "create transport":
      return createTransport(state, action.max, action.rate, action.source, action.target);
    case "delete transport":
      return deleteTransport(state, action.id);
    case "set node value":
      return setNodeVal(state, action.id, action.value);
    case "game tick":
      return gameTick(state);

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

type GameActionSetNodeValue = {
  type: "set node value";
  id: string;
  value: number;
};

type GameActionTick = {
  type: "game tick";
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
  | GameActionTick;
