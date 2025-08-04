import type { GraphType } from "./types";

export const initialState: GraphType = {
  nodes: [
    { id: "mine1", name: "Mine 1", type: "mine", val: 0 , max: 5, rate: 1, cooldown: 0},
    { id: "consumer1", name: "Consumer 1", type: "consumer", val: 0 , max: 2, rate: 0.8, cooldown: 0},
    { id: "transport1", name: "Transport 1", type: "transport", val: 0 , max: 1, rate: 0.25, cooldown: 1},
    { id: "transport2", name: "Transport 2", type: "transport", val: 0 , max: 1, rate: 0.5, cooldown: 1},
    { id: "stock1", name: "Stock 1", type: "stock", val: 0 , max: 10, closed: false},

  ],
  links: [
    {source: "mine1", target: "transport1"},
    {source: "transport1", target: "consumer1"},
    {source: "mine1", target: "transport2"},
    {source: "transport2", target: "stock1"},
    //{ source: "apple", target: "grape" },
  ],
};
