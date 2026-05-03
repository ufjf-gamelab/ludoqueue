import { it, expect, describe } from "vitest";
import type { GameType } from "../../GameTypes";
import { gameReducer } from "../../Provider";
import type {
  GameActionCreateExchanger,
  GameActionDeleteExchanger,
  GameActionChangeExchangerDirection,
} from "./ExchangerActions";
import type {
  EntityType,
  EntityExchangerType,
  EntityStockType,
} from "../EntitiesTypes";
import { recipe1 } from "./recipes";

describe("Exchanger", () => {
  it("should create exchanger1 if none exchangers exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      exchangers: [],
    };

    const actionTest: GameActionCreateExchanger = {
      type: "create exchanger",
      x: 0,
      y: 0,
      direction: "up",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.exchangers).toHaveLength(1);
    expect(result.exchangers[0]).toBe("exchanger1");
    expect(result.entities.get("exchanger1")).toBeDefined();
    expect(result.entities.get("exchanger1")?.type).toBe("exchanger");
  });

  it("should create exchanger2 if the last exchanger is exchanger1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "exchanger1",
          {
            id: "exchanger1",
            type: "exchanger",
            name: "Exchanger 1",
            recipe: { input: [["red", 1]], output: [["blue", 1]] },
            direction: "up",
            source: null,
            target: null,
            x: 0,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      exchangers: ["exchanger1"],
    };

    const actionTest: GameActionCreateExchanger = {
      type: "create exchanger",
      x: 1,
      y: 0,
      direction: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.exchangers).toHaveLength(2);
    expect(result.exchangers[1]).toBe("exchanger2");
    expect(result.entities.get("exchanger2")).toBeDefined();
    expect(result.entities.get("exchanger2")?.type).toBe("exchanger");
  });

  it("should not create exchanger if position is occupied", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "exchanger1",
          {
            id: "exchanger1",
            type: "exchanger",
            name: "Exchanger 1",
            recipe: { input: [["red", 1]], output: [["blue", 1]] },
            direction: "up",
            source: null,
            target: null,
            x: 0,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      exchangers: ["exchanger1"],
    };

    const actionTest: GameActionCreateExchanger = {
      type: "create exchanger",
      x: 0,
      y: 0,
      direction: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.exchangers).toHaveLength(1);
  });

  it("should delete existing exchanger", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "exchanger1",
          {
            id: "exchanger1",
            type: "exchanger",
            name: "Exchanger 1",
            recipe: { input: [["red", 1]], output: [["blue", 1]] },
            direction: "up",
            source: null,
            target: null,
            x: 0,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      exchangers: ["exchanger1"],
    };

    const actionTest: GameActionDeleteExchanger = {
      type: "delete exchanger",
      id: "exchanger1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.exchangers).toHaveLength(0);
    expect(result.entities.get("exchanger1")).toBeUndefined();
  });

  it("should not delete any exchanger if exchanger isnt present", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "exchanger1",
          {
            id: "exchanger1",
            type: "exchanger",
            name: "Exchanger 1",
            recipe: { input: [["red", 1]], output: [["blue", 1]] },
            direction: "up",
            source: null,
            target: null,
            x: 0,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      exchangers: ["exchanger1"],
    };

    const actionTest: GameActionDeleteExchanger = {
      type: "delete exchanger",
      id: "exchanger2",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.exchangers).toHaveLength(1);
    expect(result.entities.get("exchanger1")).toBeDefined();
  });

  it("should change exchanger direction", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "exchanger1",
          {
            id: "exchanger1",
            type: "exchanger",
            name: "Exchanger 1",
            recipe: { input: [["red", 1]], output: [["blue", 1]] },
            direction: "up",
            source: null,
            target: null,
            x: 0,
            y: 0,
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      exchangers: ["exchanger1"],
    };

    const actionTest: GameActionChangeExchangerDirection = {
      type: "change exchanger direction",
      id: "exchanger1",
      direction: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.entities.get("exchanger1")).toBeDefined();
    expect(
      (result.entities.get("exchanger1") as EntityExchangerType).direction,
    ).toBe("left");
  });

  it("should transform based on recipe 1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
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
        [
          "stock2",
          {
            id: "stock2",
            name: "Stock 2",
            type: "stock",
            max: 10,
            closed: false,
            x: 0,
            y: 2,
            direction: "down",
            goods: [],
          },
        ],
        [
          "exchanger1",
          {
            id: "exchanger1",
            type: "exchanger",
            name: "Exchanger 1",
            recipe: recipe1,
            direction: "down",
            source: "stock1",
            target: "stock2",
            x: 0,
            y: 1,
            movingGoods: [],
            goods: [
              { source: null, target: null, size: 1, time: 0, goodType: "red" },
              { source: null, target: null, size: 1, time: 2, goodType: "red" },
              {
                source: null,
                target: null,
                size: 1,
                time: 4,
                goodType: "blue",
              },
            ],
          },
        ],
      ]),

      sources: [],
      mergers: [],
      splitters: [],
      transports: [],
      consumers: [],
      stocks: ["stock1", "stock2"],
      exchangers: ["exchanger1"],
    };
    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    const stock1Entity = result.entities.get("stock1") as EntityStockType;
    const stock2Entity = result.entities.get("stock2") as EntityStockType;
    expect(stock1Entity.goods).toHaveLength(0);
    expect(stock2Entity.goods).toHaveLength(1);
    expect(stock2Entity.goods[0].goodType).toBe("green");
  });
});
