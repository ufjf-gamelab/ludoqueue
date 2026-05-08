import { it, expect, describe } from "vitest";
import type { GameType } from "../../GameTypes.ts";
import { gameReducer, type GameAction } from "../../Provider.tsx";
import type {
  GameActionCreateStock,
  GameActionDeleteStock,
} from "./StockActions.ts";
import type {
  EntityType,
  EntityStockType,
  MovingGoodType,
  EntitySplitterType,
  EntityTransportType,
  EntityMergerType,
} from "../EntitiesTypes.ts";

function makeGood(overrides?: Partial<MovingGoodType>): MovingGoodType {
  return {
    source: null,
    target: null,
    size: 1,
    time: 0,
    goodType: "red",
    ...overrides,
  };
}

function makeBaseState(): Partial<GameType> {
  return {
    entities: new Map<string, EntityType>(),
    stocks: [],
    sources: [],
    consumers: [],
    transports: [],
    splitters: [],
    mergers: [],
    time: 0,
    selected: null,
    status: "waiting",
    editor: null,
  };
}

describe("Stock", () => {
  it("should create stock1 if none stocks exists", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 10,
      x: 0,
      y: 0,
      direction: "right",
      val: 0,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(1);
    const stock = result.entities.get("stock1") as EntityStockType;
    expect(stock).toBeDefined();
    expect(stock.type).toBe("stock");
    expect(stock.max).toBe(10);
    expect(stock.goods).toEqual([]);
    expect(stock.direction).toBe("right");
  });

  it("should create stock2 if the last stock is stock1", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            max: 10,
            closed: false,
            direction: "right",
            goods: [],
            x: 0,
            y: 0,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 15,
      x: 1,
      y: 0,
      direction: "right",
      val: 0,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(2);
    expect(result.stocks[1]).toBe("stock2");
    expect(result.entities.get("stock2")).toBeDefined();
    expect(result.entities.get("stock2")?.type).toBe("stock");
  });

  it("should create stock2 with max 15", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            max: 10,
            closed: false,
            direction: "right",
            goods: [],
            x: 0,
            y: 0,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 15,
      x: 1,
      y: 0,
      direction: "right",
      val: 0,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect((result.entities.get("stock2") as EntityStockType).max).toBe(15);
  });

  it("should not create stock if position is ocupied", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "stock A",
            max: 5,
            closed: false,
            direction: "right",
            goods: [],
            x: 0,
            y: 0,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 0,
      y: 0,
      direction: "right",
    };
    expect(stateTest.stocks).toHaveLength(1);
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
  });

  it("should delete existing stock", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            max: 10,
            closed: false,
            direction: "right",
            goods: [makeGood(), makeGood({ time: 1 })],
            x: 0,
            y: 0,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: Partial<GameActionDeleteStock> = {
      type: "delete stock",
      id: "stock1",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(0);
    expect(result.entities.get("stock1")).toBeUndefined();
  });

  it("should not delete any stock if stock isnt present", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            max: 10,
            closed: false,
            direction: "right",
            goods: [makeGood()],
            x: 0,
            y: 0,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: Partial<GameActionDeleteStock> = {
      type: "delete stock",
      id: "stock2",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(1);
    expect(result.entities.get("stock1")).toBeDefined();
    expect(
      (result.entities.get("stock1") as EntityStockType).goods,
    ).toHaveLength(1);
  });

  it("should keep items unchanged", () => {
    const fakeStock: EntityStockType = {
      id: "stock1",
      type: "stock",
      name: "Stock A",
      max: 10,
      closed: false,
      direction: "right",
      goods: [makeGood(), makeGood({ time: 1 })],
      x: 0,
      y: 0,
    };
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([["stock1", fakeStock]]),
      stocks: ["stock1"],
      exchangers: [],
    };

    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(
      (result.entities.get("stock1") as EntityStockType).goods,
    ).toHaveLength(2);
    expect((result.entities.get("stock1") as EntityStockType).closed).toBe(
      false,
    );
  });

  it("should not get items if full", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock",
            max: 10,
            closed: false,
            direction: "down",
            goods: Array.from({ length: 10 }, () => makeGood()),
            x: 0,
            y: 0,
          },
        ],
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source 1",
            max: 2,
            rate: 1,
            cooldown: 0,
            leavingDirection: "left",
            goodType: "red",
            goods: [makeGood(), makeGood({ time: 1 })],
            x: 2,
            y: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            max: 1,
            rate: 1,
            cooldown: 0,
            source: "source1",
            target: "stock1",
            entryDirection: "left",
            leavingDirection: "left",
            x: 1,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      stocks: ["stock1"],
      sources: ["source1"],
      transports: ["transport1"],
      exchangers: [],
    };

    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(
      (result.entities.get("stock1") as EntityStockType).goods,
    ).toHaveLength(10);
  });

  it("should not get items if closed", () => {
    const stateTest: Partial<GameType> = {
      ...makeBaseState(),
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock",
            max: 10,
            closed: true,
            direction: "down",
            goods: [makeGood(), makeGood({ time: 1 })],
            x: 0,
            y: 0,
          },
        ],
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source 1",
            max: 2,
            rate: 1,
            cooldown: 0,
            leavingDirection: "left",
            goodType: "red",
            goods: [makeGood(), makeGood({ time: 1 })],
            x: 2,
            y: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            max: 1,
            rate: 1,
            cooldown: 0,
            source: "source1",
            target: "stock1",
            entryDirection: "left",
            leavingDirection: "left",
            x: 1,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      stocks: ["stock1"],
      sources: ["source1"],
      transports: ["transport1"],
      exchangers: [],
    };

    const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(
      (tick1.entities.get("transport1") as EntityTransportType).goods,
    ).toHaveLength(1);

    const tick2 = gameReducer(tick1, { type: "game tick" });
    expect(
      (tick2.entities.get("transport1") as EntityTransportType).goods,
    ).toHaveLength(1);

    const tick3 = gameReducer(tick2, { type: "game tick" });
    expect(
      (tick3.entities.get("transport1") as EntityTransportType).goods,
    ).toHaveLength(1);
    expect(
      (tick3.entities.get("stock1") as EntityStockType).goods,
    ).toHaveLength(2);
    expect((tick3.entities.get("stock1") as EntityStockType).closed).toBe(true);
  });

  it("should connect to transport on the left of the transport", () => {
    const fakeTransport: EntityTransportType = {
      id: "transport1",
      type: "transport",
      name: "Transport 1",
      max: 5,
      rate: 1,
      cooldown: 1.25,
      x: 1,
      y: 0,
      entryDirection: "left",
      leavingDirection: "right",
      goods: [],
      movingGoods: [],
      source: null,
      target: null,
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["transport1", fakeTransport]]),
      sources: [],
      transports: ["transport1"],
      consumers: [],
      stocks: [],
      splitters: [],
      mergers: [],
    };
    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 0,
      y: 0,
      direction: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
    const transportResult = result.entities.get(
      "transport1",
    ) as EntityTransportType;
    expect(transportResult.source).toBe("stock1");
  });

  it("should connect to splitter on the left of the transport", () => {
    const fakeSplitter: EntitySplitterType = {
      id: "splitter1",
      type: "splitter",
      name: "Splitter 1",
      max: 5,
      rate: 1,
      cooldown: 1.25,
      x: 1,
      y: 0,
      entryDirection: "left",
      goods: [],
      movingGoods: [],
      source: null,
      targets: [],
      nextTargetIndex: 0,
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["splitter1", fakeSplitter]]),
      sources: [],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: ["splitter1"],
      mergers: [],
    };
    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 0,
      y: 0,
      direction: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
    const splitterResult = result.entities.get(
      "splitter1",
    ) as EntitySplitterType;
    expect(splitterResult.source).toBe("stock1");
  });

  it("should connect as target on the left of the merger entity", () => {
    const fakeMerger: EntityMergerType = {
      id: "merger1",
      name: "Merger 1",
      type: "merger",
      max: 1,
      rate: 1,
      cooldown: 0,
      leavingDirection: "right",
      x: 1,
      y: 0,
      target: "",
      sources: [],
      nextSourceIndex: 0,
      movingGoods: [],
      goods: [],
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["merger1", fakeMerger]]),
      sources: [],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: ["merger1"],
      mergers: [],
    };
    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 0,
      y: 0,
      direction: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
    const mergerResult = result.entities.get("merger1") as EntityMergerType;
    expect(mergerResult.sources).toContain("stock1");
  });
  it("should connect to transport on the right of the transport", () => {
    const fakeTransport: EntityTransportType = {
      id: "transport1",
      type: "transport",
      name: "Transport 1",
      max: 5,
      rate: 1,
      cooldown: 1.25,
      x: 1,
      y: 0,
      entryDirection: "left",
      leavingDirection: "right",
      goods: [],
      movingGoods: [],
      source: null,
      target: null,
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["transport1", fakeTransport]]),
      sources: [],
      transports: ["transport1"],
      consumers: [],
      stocks: [],
      splitters: [],
      mergers: [],
    };
    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 2,
      y: 0,
      direction: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
    const transportResult = result.entities.get(
      "transport1",
    ) as EntityTransportType;
    expect(transportResult.target).toBe("stock1");
  });

  it("should connect as target on the left of the splitter entity", () => {
    const fakeSplitter: EntitySplitterType = {
      id: "splitter1",
      type: "splitter",
      name: "Splitter 1",
      max: 5,
      rate: 1,
      cooldown: 1.25,
      x: 1,
      y: 0,
      entryDirection: "right",
      goods: [],
      movingGoods: [],
      source: null,
      targets: [],
      nextTargetIndex: 0,
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["splitter1", fakeSplitter]]),
      sources: [],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: ["splitter1"],
      mergers: [],
    };
    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 0,
      y: 0,
      direction: "left",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
    const splitterResult = result.entities.get(
      "splitter1",
    ) as EntitySplitterType;
    expect(splitterResult.targets).toContain("stock1");
  });

  it("should connect as source on the left of the merger entity", () => {
    const fakeMerger: EntityMergerType = {
      id: "merger1",
      name: "Merger 1",
      type: "merger",
      max: 1,
      rate: 1,
      cooldown: 0,
      leavingDirection: "right",
      x: 1,
      y: 0,
      target: "",
      sources: [],
      nextSourceIndex: 0,
      movingGoods: [],
      goods: [],
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["merger1", fakeMerger]]),
      sources: [],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: ["merger1"],
      mergers: [],
    };
    const actionTest: GameActionCreateStock = {
      type: "create stock",
      max: 15,
      val: 0,
      x: 2,
      y: 0,
      direction: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
    const mergerResult = result.entities.get("merger1") as EntityMergerType;
    expect(mergerResult.target).toBe("stock1");
  });
});
