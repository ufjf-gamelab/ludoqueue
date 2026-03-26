import { it, expect, describe } from "vitest";
import type { GameType } from "../../types.ts";
import type { EntityType, EntityMergerType } from "../EntitiesTypes.ts";
import { gameReducer, type GameAction } from "../../Provider.tsx";

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
});
