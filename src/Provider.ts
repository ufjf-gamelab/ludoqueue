import type { GraphType } from "./types";

export function gameReducer(state: GraphType, action: GameAction): GraphType {
  switch (action.type) {
    case "create link":
        return createLink(state,action.source,action.target);
    default:
      break;
  }
  return state;
}

function createLink(state: GraphType, source: string, target:string): GraphType {
  const isPresent = state.links.some(
    ({ source: sourceLink, target: targetLink }) => {
      return (
        (sourceLink === source && targetLink === target) ||
        (sourceLink === target && targetLink === source)
      );
    }
  );
  if (isPresent) return state;
  state.links.push({ source, target });
  const newGraph = { ...state };
  return (newGraph);
}

type GameAction = {
  type: "create link";
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
