import { createContext, useContext, useReducer, type ReactNode } from "react";
import type {
  GameType,
  NodeConsumerType,
  NodeMineType,
  NodeStockType,
  NodeTransportType,
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
    case "create link":
      return createLink(state, action.source, action.target);

    case "delete link":
      return deleteLink(state, action.source, action.target);

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
  const node = newState.entities.find((n) => n.id == nodeID);
  if (!node) {
    return state;
  }
  node.val = value;
  return newState;
}

export function gameTick(state: GameType) {
  const mines = new Map<string, NodeMineType>();
  const consumers = new Map<string, NodeConsumerType>();
  const transports = new Map<string, NodeTransportType>();
  const stocks = new Map<string, NodeStockType>();

  const newState = structuredClone(state);
  for (const [, node] of newState.entities) { // pega apenas node
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

export function gameMineTick(node: NodeMineType) {
  node.cooldown -= 1;
  if (node.cooldown > 0) {
    return;
  }

  if (node.val < node.max) {
    node.val += node.rate;
  }
  node.cooldown += 1 / node.rate;
}

export function gameConsumerTick(node: NodeConsumerType) {
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
  transport: NodeTransportType,
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
    if(target.type=="stock" && target.closed){
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

type GameActionLinkNodes = {
  type: "create link" | "delete link";
  source: string;
  target: string;
};

export type GameAction =
  | GameActionLinkNodes
  | GameActionSetNodeValue
  | GameActionTick;
