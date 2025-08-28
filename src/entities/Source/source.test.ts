import { it, expect, describe } from "vitest";
import type { GameType } from "../../types.ts";
import type { EntityType, EntitySourceType } from "../EntitiesTypes.ts";
import {
  gameSourceTick,
  gameReducer,
  type GameAction,
} from "../../Provider.tsx";
import type {
  GameActionCreateSource,
  GameActionDeleteSource,
} from "./SourceActions.ts";

describe("Source", () => {
  it("should create source1 if none sources exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      sources: [],
    };

    const actionTest: Partial<GameActionCreateSource> = {
      type: "create source",
      max: 10,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0]).toBe("source1");
    expect(result.entities.get("source1")).toBeDefined();
    expect(result.entities.get("source1")?.type).toBe("source");
  });

  it("should create source2 if the last source is source1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: Partial<GameActionCreateSource> = {
      type: "create source",
      max: 15,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.sources).toHaveLength(2);
    expect(result.sources[1]).toBe("source2");
    expect(result.entities.get("source2")).toBeDefined();
    expect(result.entities.get("source2")?.type).toBe("source");
  });

  it("should create source with max 15", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: Partial<GameActionCreateSource> = {
      type: "create source",
      max: 15,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.sources).toHaveLength(2);
    expect((result.entities.get("source2") as EntitySourceType).max).toBe(15);
  });

  it("should delete existing source", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: Partial<GameActionDeleteSource> = {
      type: "delete source",
      id: "source1",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.sources).toHaveLength(0);
    expect(result.entities.get("source1")).toBeUndefined();
  });

  it("should not delete any source if source isnt present", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 5,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: Partial<GameActionDeleteSource> = {
      type: "delete source",
      id: "source2",
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.sources).toHaveLength(1);
    expect(result.entities.get("source1")).toBeDefined();
  });

  it("should increment value by rate", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 0,
    };
    gameSourceTick(fakeSource);
    expect(fakeSource.val).toBe(1);
  });

  it("should not increment when at max", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 5,
      max: 5,
      rate: 1,
      cooldown: 0,
    };
    gameSourceTick(fakeSource);
    expect(fakeSource.val).toBe(5);
  });
  it("should not increment when on cooldown", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 1.25,
    };
    gameSourceTick(fakeSource);
    expect(fakeSource.val).toBe(0);
  });
  it("should reset cooldown after tick", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 1,
    };
    gameSourceTick(fakeSource);
    expect(fakeSource.cooldown).toBe(1 / fakeSource.rate);
  });
});
