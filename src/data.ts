import type { GraphType } from "./types";

export const initialState: GraphType = {
  nodes: [
    { id: "mine1", name: "Mine 1", type: "mine", val: 0 , max: 5},
    { id: "consumer1", name: "Consumer 1", type: "consumer", val: 0 , max: 2},
    { id: "stock1", name: "Stock 1", type: "stock", val: 0 , max: 10, closed: false},

  ],
  links: [
    { type: "transport", source: "mine1", target: "stock1" , val: 0},
    { type: "transport", source: "stock1", target: "consumer1" , val: 0},
    //{ source: "apple", target: "grape" },
  ],
};
