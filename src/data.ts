import type { GraphType } from "./types";

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