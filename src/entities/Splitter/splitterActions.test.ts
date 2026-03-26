import { it, expect, describe } from "vitest";
import type { GameType } from "../../types.ts";
import type { EntityType, EntitySplitterType } from "../EntitiesTypes.ts";
import { gameReducer, type GameAction } from "../../Provider.tsx";

describe("Splitter", () => {
  it("should create splitter1 on empty board", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      splitters: [],
    };

    const actionTest: Partial<GameAction> = {
      type: "create splitter",
      max: 10,
      rate: 2,
      x: 0,
      y: 0,
      entryDirection: "up",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);

    expect(result.splitters).toHaveLength(1);
    expect(result.splitters[0]).toBe("splitter1");
    expect(result.entities.get("splitter1")).toBeDefined();
    expect(result.entities.get("splitter1")?.type).toBe("splitter");
  });

  it("should delete existing splitter", () => {
    const splitter: EntitySplitterType = {
      id: "splitter1",
      name: "Splitter 1",
      type: "splitter",
      max: 10,
      rate: 2,
      cooldown: 1,
      entryDirection: "up",
      x: 0,
      y: 0,
      source: null,
      targets: [],
      nextTargetIndex: 0,
      movingGoods: [],
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["splitter1", splitter]]),
      splitters: ["splitter1"],
    };

    const actionTest: Partial<GameAction> = {
      type: "delete splitter",
      id: "splitter1",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);

    expect(result.splitters).toHaveLength(0);
    expect(result.entities.get("splitter1")).toBeUndefined();
  });

  it("should change splitter entry direction", () => {
    const splitter: EntitySplitterType = {
      id: "splitter1",
      name: "Splitter 1",
      type: "splitter",
      max: 10,
      rate: 2,
      cooldown: 1,
      entryDirection: "up",
      x: 0,
      y: 0,
      source: null,
      targets: [],
      nextTargetIndex: 0,
      movingGoods: [],
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["splitter1", splitter]]),
      splitters: ["splitter1"],
    };

    const actionTest: Partial<GameAction> = {
      type: "change splitter entry direction",
      id: "splitter1",
      direction: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);

    expect(result.entities.get("splitter1")).toBeDefined();
    expect(
      (result.entities.get("splitter1") as EntitySplitterType).entryDirection,
    ).toBe("left");
  });
});
