import { it, expect, describe } from "vitest";
import type { GameType } from "../../types.ts";
import { gameReducer, type GameAction } from "../../Provider.tsx";
import type {
  GameActionCreateStock,
  GameActionDeleteStock,
} from "./StockActions.ts";
import type { EntityType, EntityStockType } from "../EntitiesTypes.ts";

describe("Stock", () => {
  it("should create stock1 if none stocks exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      stocks: [],
    };

    const actionTest: Partial<GameActionCreateStock> = {
      type: "create stock",
      max: 10,
      x: 0,
      y: 0,
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
            x: 0,
            y: 0,
            entryDirection: "left",
            leavingDirection: "right",
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
            x: 0,
            y: 0,
            entryDirection: "left",
            leavingDirection: "right",
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
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.stocks).toHaveLength(2);
    expect((result.entities.get("stock2") as EntityStockType).max).toBe(15);
  });

  it("should not create stock if position is ocupied", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "stock A",
            val: 0,
            max: 5,
            x: 0,
            y: 0,
            closed: false,
            entryDirection: "left",
            leavingDirection: "right",
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
    };
    expect(stateTest.stocks).toHaveLength(1);
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.stocks).toHaveLength(1);
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
            x: 0,
            y: 0,
            entryDirection: "left",
            leavingDirection: "right",
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
            x: 0,
            y: 0,
            entryDirection: "left",
            leavingDirection: "right",
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
      x: 0,
      y: 0,
      entryDirection: "left",
            leavingDirection: "right",
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
            x: 0,
            y: 0,
            leavingDirection: "down",
            entryDirection: "right",
          },
        ],
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source 1",
            val: 2,
            max: 2,
            rate: 1,
            cooldown: 0,
            x: 2,
            y: 0,
            leavingDirection: "left",
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
            direction: "left",
            x: 1,
            y: 0,
            movingGoods: [],
          },
        ],
      ]),
      stocks: ["stock1"],
      sources: ["source1"],
    };

    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(result.entities.get("stock1")?.val).toBe(10);
    expect((result.entities.get("stock1") as EntityStockType).closed).toBe(
      false
    );
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
            x: 0,
            y: 0,
            leavingDirection: "down",
            entryDirection: "right",
          },
        ],
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source 1",
            val: 2,
            max: 2,
            rate: 1,
            cooldown: 0,
            x: 2,
            y: 0,
            leavingDirection: "left",
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
            direction: "left",
            x: 1,
            y: 0,
            movingGoods: [],
          },
        ],
      ]),
      stocks: ["stock1"],
      sources: ["source1"],
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
