import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { GraphType } from "./types";
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

    case "set node value":
      return setNodeVal(state,action.id,action.value);

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

function setNodeVal(state:GraphType, nodeID: string,value: number){
  const newState = structuredClone(state);
  const node = newState.nodes.find(n => n.id==nodeID);
  if (!node){
    return state;
  }
  node.val=value;
  return newState;
}

type GameActionSetNodeValue = {
  type: "set node value";
  id: string;
  value: number;
}

type GameActionLinkNodes = {
  type: "create link" | "delete link";
  source: string;
  target: string;
}

export type GameAction = GameActionLinkNodes|GameActionSetNodeValue;

