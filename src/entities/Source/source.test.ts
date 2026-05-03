import { it, expect, describe } from "vitest";
import type { GameType } from "../../GameTypes.ts";
import type {
  EntityType,
  EntitySourceType,
  EntityTransportType,
  EntitySplitterType,
  EntityMergerType,
} from "../EntitiesTypes.ts";
import { gameReducer, type GameAction } from "../../Provider.tsx";
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
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 1,
            leavingDirection: "right",
            goods: [],
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: Partial<GameActionCreateSource> = {
      type: "create source",
      max: 15,
      x: 1,
      y: 1,
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
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: Partial<GameActionCreateSource> = {
      type: "create source",
      max: 15,
      x: 1,
      y: 0,
    };

    const result = gameReducer(stateTest as GameType, actionTest as GameAction);
    expect(result.sources).toHaveLength(2);
    expect((result.entities.get("source2") as EntitySourceType).max).toBe(15);
  });

  it("should not create source if position is ocupied", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "source A",
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
          },
        ],
      ]),
      sources: ["source1"],
    };

    const actionTest: GameActionCreateSource = {
      type: "create source",
      max: 15,
      x: 0,
      y: 0,
      leavingDirection: "left",
      goodType: "blue",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.sources).toHaveLength(1);
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
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
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
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
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

  it("should add a good when not on cooldown", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      goodType: "red",
      max: 5,
      rate: 1,
      cooldown: 0,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["source1", fakeSource]]),
      sources: ["source1"],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: [],
      mergers: [],
      exchangers: [],
    };
    const result = gameReducer(stateTest as GameType, { type: "game tick" });

    const updatedSource = result.entities.get("source1") as EntitySourceType;
    expect(updatedSource.goods).toHaveLength(1);
  });

  it("should not add a good when at max", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      goodType: "red",
      max: 5,
      rate: 1,
      cooldown: 0,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goods: Array.from({ length: 5 }, () => ({
        source: null,
        target: null,
        size: 1,
        time: 0,
        goodType: "red",
      })),
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["source1", fakeSource]]),
      sources: ["source1"],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: [],
      mergers: [],
      exchangers: [],
    };
    const result = gameReducer(stateTest as GameType, { type: "game tick" });

    const updatedSource = result.entities.get("source1") as EntitySourceType;
    expect(updatedSource.goods).toHaveLength(5);
  });

  it("should not add a good when on cooldown", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      goodType: "red",
      max: 5,
      rate: 1,
      cooldown: 1.25,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["source1", fakeSource]]),
      sources: ["source1"],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: [],
      mergers: [],
      exchangers: [],
    };
    const result = gameReducer(stateTest as GameType, { type: "game tick" });

    const updatedSource = result.entities.get("source1") as EntitySourceType;
    expect(updatedSource.goods).toHaveLength(0);
  });

  it("should reset cooldown after tick", () => {
    const fakeSource: EntitySourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      goodType: "red",
      max: 5,
      rate: 1,
      cooldown: 1,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goods: [],
    };

    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([["source1", fakeSource]]),
      sources: ["source1"],
      transports: [],
      consumers: [],
      stocks: [],
      splitters: [],
      mergers: [],
      exchangers: [],
    };
    const result = gameReducer(stateTest as GameType, { type: "game tick" });

    const updatedSource = result.entities.get("source1") as EntitySourceType;
    expect(updatedSource.cooldown).toBe(1 / updatedSource.rate);
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
    const actionTest: GameActionCreateSource = {
      type: "create source",
      max: 15,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goodType: "blue",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.sources).toHaveLength(1);
    const transportResult = result.entities.get(
      "transport1",
    ) as EntityTransportType;
    expect(transportResult.source).toBe("source1");
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
    const actionTest: GameActionCreateSource = {
      type: "create source",
      max: 15,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goodType: "blue",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.sources).toHaveLength(1);
    const splitterResult = result.entities.get(
      "splitter1",
    ) as EntitySplitterType;
    expect(splitterResult.source).toBe("source1");
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
    const actionTest: GameActionCreateSource = {
      type: "create source",
      max: 15,
      x: 0,
      y: 0,
      leavingDirection: "right",
      goodType: "blue",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.sources).toHaveLength(1);
    const mergerResult = result.entities.get("merger1") as EntityMergerType;
    expect(mergerResult.sources).toContain("source1");
  });
});
