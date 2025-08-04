import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { GraphType } from "./types";
import { initialState } from "./data";
import { debug } from "three/tsl";
import { radToDeg } from "three/src/math/MathUtils.js";
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

export function gameReducer(state: GraphType, action: GameAction): GraphType {
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

function createLink(
  state: GraphType,
  source: string,
  target: string
): GraphType {
  const isPresent = state.links.some(
    ({ source: sourceLink, target: targetLink }) => {
      return (
        (sourceLink === source && targetLink === target) ||
        (sourceLink === target && targetLink === source)
      );
    }
  );
  if (isPresent) return state;
  const newState = structuredClone(state);
  newState.links.push({ source, target });
  return newState;
}

function deleteLink(
  state: GraphType,
  source: string,
  target: string
): GraphType {
  const isPresent = state.links.some(
    ({ source: sourceLink, target: targetLink }) => {
      return (
        (sourceLink === source && targetLink === target) ||
        (sourceLink === target && targetLink === source)
      );
    }
  );
  if (!isPresent) return state;
  const newState = structuredClone(state);
  newState.links = newState.links.filter((link) => {
    return !(
      (link.source == source && link.target == target) ||
      (link.target == source && link.source == target)
    );
  });
  return newState;
}

function setNodeVal(state: GraphType, nodeID: string, value: number) {
  const newState = structuredClone(state);
  const node = newState.nodes.find((n) => n.id == nodeID);
  if (!node) {
    return state;
  }
  node.val = value;
  return newState;
}

function gameTick(state: GraphType) {
  const newState = structuredClone(state);
  for (let i = 0; i < newState.nodes.length; i++) {
    const node = newState.nodes[i];
    switch (node.type) {
      case "mine": {
        if (node.cooldown > 0) {
          node.cooldown -= 1;
          continue;
        }

        if (node.val < node.max) {
          node.val++;
        }
        node.cooldown += 1 / node.rate;
        break;
      }
      case "consumer": {
        if (node.cooldown > 0) {
          node.cooldown -= 1;
          continue;
        }
        if (node.val > 0) {
          node.val--;
        }
        node.cooldown += 1 / node.rate;
        break;
      }
      case "transport": {
        if (node.cooldown > 0) {
          node.cooldown -= 1;
          continue;
        }
        node.cooldown += 1 / node.rate;
        for (let i = 0; i < newState.links.length; i++) {
          const link = newState.links[i];
          const source = newState.nodes.find((n) => n.id === link.source);
          const target = newState.nodes.find((n) => n.id === link.target);
          if (!source || !target) {
            continue;
          }
          if (source.id != node.id && target.id != node.id) {
            //verifica se link é valido
            //adicionar remoção de link invalido antes de retornar?
            continue;
          }
          if (node.val === 1 && (source.id===node.id) && target.val < target.max) {
            node.val--;
            target.val++;
            break;
          } else if (node.val === 0 && (target.id===node.id) && source.val > 0) {
            node.val++;
            source.val--;
            break;
          }
        }
      }
      break;
    }
  }
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

type GameActionLinkNodes = {
  type: "create link" | "delete link";
  source: string;
  target: string;
};

export type GameAction =
  | GameActionLinkNodes
  | GameActionSetNodeValue
  | GameActionTick;
