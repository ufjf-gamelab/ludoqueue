import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { GraphType } from "./types";
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
export function useGame(){
  return useContext(GameContext);
}
export function useGameDispatch(){
  return useContext(DispatchContext);
}

export function gameReducer(state: GraphType, action: GameAction): GraphType {
  switch (action.type) {
    case "create link":
      return createLink(state, action.source, action.target);

    case "delete link":
      return deleteLink(state, action.source, action.target);

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

export type GameAction = {
  type: "create link" | "delete link";
  source: string;
  target: string;
};

export const initialState: GraphType = {
  nodes: [
    { id: "apple", name: "Apple", val: 0 },
    { id: "grape", name: "Grape", val: 0 },
    { id: "banana", name: "Banana", val: 0 },
    { id: "cashew", name: "Cashew", val: 0 },
  ],
  links: [
    { source: "apple", target: "grape" },
    { source: "apple", target: "banana" },
    { source: "grape", target: "banana" },
    { source: "banana", target: "apple" },
    { source: "banana", target: "cashew" },
  ],
};
