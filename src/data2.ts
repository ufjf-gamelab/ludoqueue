import type { GameType } from "./types";
import type {
  EntityType,
} from "./entities/EntitiesTypes"

export const initialState2: GameType = {
  entities: new Map<string, EntityType>([
    [
      "source1",
      {
        id: "source1",
        name: "Source 1",
        type: "source",
        goodType: "red",
        max: 5,
        rate: 1,
        cooldown: 0,
        x: 0,
        y: 0,
        leavingDirection: "right",
        goods: [],
      },
    ],
    [
      "consumer1",
      {
        id: "consumer1",
        name: "Consumer 1",
        type: "consumer",
        max: 2,
        rate: 1,
        cooldown: 0,
        x: 2,
        y: 0,
        entryDirection: "left",
        goods: [],
      },
    ],
    [
      "transport1",
      {
        id: "transport1",
        name: "Transport 1",
        type: "transport",
        max: 1,
        rate: 1,
        cooldown: 1,
        source: "source1",
        target: "consumer1",
        x: 1,
        y: 0,
        entryDirection: "left",
        leavingDirection: "right",
        movingGoods: [],
        goods: [],
      },
    ],
    
    [
      "stock1",
      {
        id: "stock1",
        name: "Stock 1",
        type: "stock",
        max: 10,
        closed: false,
        x: 0,
        y: 2,
        direction: "down",
        goods: [],
      },
    ],
  ]),
  selected: null,
  status: "waiting",
  stocks: ["stock1"],
  sources: ["source1"],
  consumers: ["consumer1"],
  transports: ["transport1"],
  splitters: [],
  mergers: [],
  editor: null,
  time: 0,
};
