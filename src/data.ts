import type { GraphType } from "./types";

export const initialState: GraphType = {
  nodes: [
    { id: "mine1", name: "Mine 1", type: "mine", val: 0 , max: 5, rate: 1, cooldown: 0},
    { id: "consumer1", name: "Consumer 1", type: "consumer", val: 0 , max: 2, rate: 0.25, cooldown: 0},
    { id: "transport1", name: "Transport 1", type: "transport", val: 0 , max: 1, rate: 1, cooldown: 0.25},
    { id: "stock1", name: "Stock 1", type: "stock", val: 0 , max: 10, closed: false},

  ],
  links: [
    {source: "mine1", target: "transport1" , val: 0},
    {source: "transport1", target: "consumer1" , val: 0},
    //{ source: "apple", target: "grape" },
  ],
};
