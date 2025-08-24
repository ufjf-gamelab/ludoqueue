import { it, expect, describe } from "vitest";
import type { GameType, EntityType, EntityStockType } from "../../types.ts";
import {
  gameReducer,
  type GameAction,
} from "../../Provider.tsx";
import type { GameActionCreateStock, GameActionDeleteStock } from "./StockActions.ts";

describe("Stock", () => {
  it("should create stock1 if none stocks exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      stocks: [],
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 10,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(1);
    expect(result.stocks[0]).toBe("stock1");
    expect(result.entities.get("stock1")).toBeDefined();
    expect(result.entities.get("stock1")?.type).toBe("stock");
  });

  it("should create stock2 if the last stock is stock1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            val: 0,
            max: 10,
            closed: false,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 15,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(2);
    expect(result.stocks[1]).toBe("stock2");
    expect(result.entities.get("stock2")).toBeDefined();
    expect(result.entities.get("stock2")?.type).toBe("stock");
  });

  it("should create stock2 with max 15", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            val: 0,
            max: 10,
            closed: false,
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 15,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(2);
    expect((result.entities.get("stock2") as EntityStockType).max).toBe(15);
  });

  it("should delete existing stock", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            val: 5,
            max: 10,
            closed: false,
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
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock 1",
            val: 5,
            max: 10,
            closed: false,
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
    expect((result.entities.get("stock1") as EntityStockType).val).toBe(5);
  });

  it("should keep items unchanged", () => {
    const fakeStock: EntityStockType = {
      id: "stock1",
      type: "stock",
      name: "Stock A",
      max: 10,
      val: 2,
      closed: false,
    };
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["stock1", fakeStock]]),
      stocks: ["stock1"],
    };

    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(result.entities.get("stock1")?.val).toBe(2);
    expect((result.entities.get("stock1") as EntityStockType).closed).toBe(
      false
    );
  });

  it("should not get items if full", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock",
            val: 10,
            max: 10,
            closed: false,
          },
        ],
        [
          "source1",
          {
            id: "source1",
            type: "consumer",
            name: "Consumer",
            val: 2,
            max: 2,
            rate: 1,
            cooldown: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            val: 1,
            max: 1,
            rate: 1,
            cooldown: 0,
            source: "source1",
            target: "stock1",
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(result.entities.get("stock1")?.val).toBe(10);
    expect((result.entities.get("stock1") as EntityStockType).closed).toBe(false);
  });

  it("should not get items if closed", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock",
            val: 2,
            max: 10,
            closed: true,
          },
        ],
        [
          "source1",
          {
            id: "source1",
            type: "consumer",
            name: "Consumer",
            val: 2,
            max: 2,
            rate: 1,
            cooldown: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            val: 0,
            max: 1,
            rate: 1,
            cooldown: 0,
            source: "source1",
            target: "stock1",
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(tick1.entities.get("transport1")?.val).toBe(1);

    const tick2 = gameReducer(tick1, { type: "game tick" });
    expect(tick2.entities.get("transport1")?.val).toBe(1);

    const tick3 = gameReducer(tick2, { type: "game tick" });
    expect(tick3.entities.get("transport1")?.val).toBe(1);
    expect(tick3.entities.get("stock1")?.val).toBe(2);
    expect((tick3.entities.get("stock1") as EntityStockType).closed).toBe(true);
  });
});
