import { it, expect, describe } from "vitest";
import type { GameType } from "../../types.ts";
import type { EntityType, EntityMergerType } from "../EntitiesTypes.ts";
import { gameReducer, type GameAction } from "../../Provider.tsx";
import type { GameActionCreateMerger } from "./MergerActions.ts";

describe("Merger", () => {
  it("should create merger1 on empty board", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      mergers: [],
    };

    const actionTest: Partial<GameAction> = {
      type: "create merger",
      max: 10,
      rate: 2,
      x: 0,
      y: 0,
      leavingDirection: "down",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);

    expect(result.mergers).toHaveLength(1);
    expect(result.mergers[0]).toBe("merger1");
    expect(result.entities.get("merger1")?.type).toBe("merger");
  });

  it("should delete existing merger", () => {
    const merger: EntityMergerType = {
      id: "merger1",
      name: "Merger 1",
      type: "merger",
      max: 10,
      rate: 2,
      cooldown: 1,
      target: null,
      sources: [],
      x: 0,
      y: 0,
      leavingDirection: "down",
      movingGoods: [],
      nextSourceIndex: 0,
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["merger1", merger]]),
      mergers: ["merger1"],
    };

    const actionTest: Partial<GameAction> = {
      type: "delete merger",
      id: "merger1",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);

    expect(result.mergers).toHaveLength(0);
    expect(result.entities.get("merger1")).toBeUndefined();
  });

  it("should change merger leaving direction", () => {
    const merger: EntityMergerType = {
      id: "merger1",
      name: "Merger 1",
      type: "merger",
      max: 10,
      rate: 2,
      cooldown: 1,
      target: null,
      sources: [],
      x: 0,
      y: 0,
      leavingDirection: "down",
      movingGoods: [],
      nextSourceIndex: 0,
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["merger1", merger]]),
      mergers: ["merger1"],
    };

    const actionTest: Partial<GameAction> = {
      type: "change merger leaving direction",
      id: "merger1",
      direction: "right",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);

    expect(
      (result.entities.get("merger1") as EntityMergerType).leavingDirection,
    ).toBe("right");
  });

  it ("should connect to entities", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(
        [[
      "source1",
      {
        id: "source1",
        name: "Source 1",
        type: "source",
        goodType: "blue",
        max: 5,
        rate: 1,
        cooldown: 0,
        x: 3,
        y: 2,
        leavingDirection: "down",
        goods: [],
      },
    ],

    [
      "merger1",
      {
        id: "merger1",
        name: "Merger 1",
        type: "merger",
        max: 1,
        rate: 1,
        cooldown: 0,
        leavingDirection: "down",
        x: 4,
        y: 3,
        target: null,
        sources: [],
        nextSourceIndex: 0,
        movingGoods: [],
        goods: [],
      },
    ],
    [
      "source2",
      {
        id: "source2",
        name: "Source 2",
        type: "source",
        goodType: "red",
        max: 5,
        rate: 1,
        cooldown: 0,
        x: 2,
        y: 3,
        leavingDirection: "right",
        goods: [],
      },]
      ]),
      mergers: ["merger1"],
      sources: ["source1","source2"],
    }
    const  actionTest: GameActionCreateMerger = {
      type: "create merger",
      rate: 1,
      max: 1,
      x: 3,
      y: 3,
      leavingDirection: "right"
    }
    const result = gameReducer(stateTest as GameType,actionTest);
    expect(result.mergers).toHaveLength(2);
    expect(result.entities.get("merger2")).toBeDefined();
    const mergerEntity = result.entities.get("merger2") as EntityMergerType;
    expect(mergerEntity.sources).toHaveLength(2);
  expect(mergerEntity.sources).toContain("source1");
  expect(mergerEntity.sources).toContain("source2");
    expect(mergerEntity.target).toBe("merger1");
  })
});
