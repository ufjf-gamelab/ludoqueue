import { createContext, useContext, useReducer, type ReactNode } from "react";
import type {
  GameType,
  EntityConsumerType,
  EntityMineType,
  EntityStockType,
  EntityTransportType,
  EntityType,
} from "./types";
import { initialState } from "./data";
type GameProviderProps = {
  children: ReactNode;
};
export const GameContext = createContext(null);
export const DispatchContext = createContext(null);
export default function GameProvider({ children }: GameProviderProps) {
  const [game, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext value={game}>
      <DispatchContext value={dispatch}>{children}</DispatchContext>
    </GameContext>
  );
}
export function useGame() {
  return useContext(GameContext);
}
export function useGameDispatch() {
  return useContext(DispatchContext);
}

export function gameReducer(state: GameType, action: GameAction): GameType {
  switch (action.type) {
    case "create stock":
      return createStock(state, action.max);
    case "delete stock":
      return deleteStock(state, action.id);
    case "set node value":
      return setNodeVal(state, action.id, action.value);

    case "game tick":
      return gameTick(state);

    default:
      break;
  }
  return state;
}

function createStock(state: GameType, max: number) {
  let numberID: number = 1;
  if (state.stocks.length > 0) {
    const lastStockNumber = state.stocks
      .map((stockId) => parseInt(stockId.replace("stock", "")))
      .reduce((max, current) => Math.max(max, current), 0);
    numberID = lastStockNumber + 1;
  }

  const newState = structuredClone(state);
  const newStockID: string = "stock" + numberID;
  const newStockEntity: EntityStockType = {
    id: newStockID,
    name: "Stock " + numberID,
    type: "stock",
    val: 0,
    max: max,
    closed: false,
  };
  newState.entities.set(newStockID, newStockEntity);
  newState.stocks.push(newStockID);
  return newState;
}

function deleteStock(state: GameType, stock: string) {
  const stockIndex = state.stocks.indexOf(stock); //pelo createStock ele sempre criara id a partir do ultimo, entao nao ocorre de ter dois iguais
  if (stockIndex !== -1) {
    const newState = structuredClone(state);
    newState.stocks.splice(stockIndex);
    newState.entities.delete(stock);
    return newState;
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
  const mines = new Map<string, EntityMineType>();
  const consumers = new Map<string, EntityConsumerType>();
  const transports = new Map<string, EntityTransportType>();
  const stocks = new Map<string, EntityStockType>();

  const newState = structuredClone(state);
  for (const [, node] of newState.entities.entries()) {
    // pega apenas node
    switch (node.type) {
      case "mine": {
        mines.set(node.id, node);
        //gameMineTick(node);
        break;
      }
      case "consumer": {
        consumers.set(node.id, node);
        //gameConsumerTick(node);
        break;
      }
      case "transport": {
        transports.set(node.id, node);
        //gameTransportTick(node, newState);
        break;
      }
      case "stock": {
        stocks.set(node.id, node);
        break;
      }
    }
  }
  const all = new Map<string, EntityType>([
    ...mines.entries(),
    ...consumers.entries(),
    ...transports.entries(),
    ...stocks.entries(),
  ]);

  transports.forEach((transport) => {
    gameTransportTick(transport, all);
  });
  mines.forEach((mine) => {
    gameMineTick(mine);
  });
  consumers.forEach((consumer) => {
    gameConsumerTick(consumer);
  });
  //newState.links.forEach((link) => {
  //  const source = all.get(link.source)!;
  //  const target = all.get(link.target)!;
  //  if (source.type === "transport") {
  //    source.target = target.id;
  //  } else if (target.type === "transport") {
  //    target.source = source.id;
  //  }
  //});

  return newState;
}

export function gameMineTick(node: EntityMineType) {
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

export type GameActionCreateStock = {
  type: "create stock";
  max: number;
  val: number;
};

export type GameActionDeleteStock = {
  type: "delete stock";
  id: string;
};

export type GameAction =
  | GameActionCreateStock
  | GameActionSetNodeValue
  | GameActionTick
  | GameActionDeleteStock;
