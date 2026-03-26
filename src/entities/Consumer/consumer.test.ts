import { it, expect, describe } from "vitest";
import type { GameType } from "../../types";
import { gameConsumerTick, gameReducer } from "../../Provider";
import type {
  GameActionCreateConsumer,
  GameActionDeleteConsumer,
} from "./ConsumerActions";
import type { EntityType, EntityConsumerType, EntitySplitterType, EntityMergerType, EntityTransportType } from "../EntitiesTypes";

describe("Consumer", () => {
  it("should create consumer1 if none consumers exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>(),
      consumers: [],
    };

    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 10,
      rate: 1,
      x: 0,
      y: 0,
      entryDirection: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(1);
    expect(result.consumers[0]).toBe("consumer1");
    expect(result.entities.get("consumer1")).toBeDefined();
    expect(result.entities.get("consumer1")?.type).toBe("consumer");
  });

  it("should create consumer2 if the last consumer is consumer1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
      ]),
      consumers: ["consumer1"],
    };

    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 1,
      y: 0,
      entryDirection: "left",
    };
    expect(stateTest.consumers).toHaveLength(1);
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(2);
    expect(result.consumers[1]).toBe("consumer2");
    expect(result.entities.get("consumer2")).toBeDefined();
    expect(result.entities.get("consumer2")?.type).toBe("consumer");
  });

  it("should create consumer with max 15", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
      ]),
      consumers: ["consumer1"],
    };

    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 1,
      y: 0,
      entryDirection: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(2);
    expect((result.entities.get("consumer2") as EntityConsumerType).max).toBe(
      15,
    );
  });

  it("should create consumer with rate 1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
      ]),
      consumers: ["consumer1"],
    };

    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 1,
      y: 0,
      entryDirection: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(2);
    expect((result.entities.get("consumer2") as EntityConsumerType).rate).toBe(
      1,
    );
  });

  it("should not create consumer if position is ocupied", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
      ]),
      consumers: ["consumer1"],
    };

    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 0,
      y: 0,
      entryDirection: "left",
    };
    expect(stateTest.consumers).toHaveLength(1);
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(1);
  });

  it("should delete existing consumer", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
      ]),
      consumers: ["consumer1"],
    };

    const actionTest: GameActionDeleteConsumer = {
      type: "delete consumer",
      id: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(0);
    expect(result.entities.get("consumer1")).toBeUndefined();
  });

  it("should not delete any consumer if consumer isnt present", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
      ]),
      consumers: ["consumer1"],
    };

    const actionTest: GameActionDeleteConsumer = {
      type: "delete consumer",
      id: "consumer2",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(1);
    expect(result.entities.get("consumer1")).toBeDefined();
  });

  it("should decrease goods by rate", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      max: 2,
      rate: 1,
      cooldown: 0,
      x: 0,
      y: 0,
      entryDirection: "left",
      goods: [
        {
          source: null,
          target: null,
          size: 1,
          time: 0,
          goodType: "red",
        },
      ],
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.goods).toHaveLength(0);
  });

  it("should not decrease below zero", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      max: 2,
      rate: 1,
      cooldown: 0,
      x: 0,
      y: 0,
      entryDirection: "left",
      goods: [],
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.goods).toHaveLength(0);
  });

  it("should not decrease when on cooldown", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      max: 2,
      rate: 1,
      cooldown: 2,
      x: 0,
      y: 0,
      entryDirection: "left",
      goods: [
        {
          source: null,
          target: null,
          size: 1,
          time: 0,
          goodType: "red",
        },
      ],
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.goods).toHaveLength(1);
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.goods).toHaveLength(0);
  });

  it("should reset cooldown after tick", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      max: 2,
      rate: 1,
      cooldown: 1,
      x: 0,
      y: 0,
      entryDirection: "left",
      goods: [
        {
          source: null,
          target: null,
          size: 1,
          time: 0,
          goodType: "red",
        },
      ],
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.cooldown).toBe(1);
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
    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 2,
      y: 0,
      entryDirection: "left",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(1);
    const transportResult = result.entities.get(
      "transport1",
    ) as EntityTransportType;
    expect(transportResult.target).toBe("consumer1");
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
    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 0,
      y: 0,
      entryDirection: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(1);
    const splitterResult = result.entities.get(
      "splitter1",
    ) as EntitySplitterType;
    expect(splitterResult.targets).toBe(["consumer1"]);
  });

  it("should connect as source on the left of the merger entity", () => {
    const fakeMerger: EntityMergerType = {
      id: "merger1",
      name: "Merger 1",
      type: "merger",
      max: 1,
      rate: 1,
      cooldown: 0,
      leavingDirection: "left",
      x: 1,
      y: 0,
      target: "",
      sources: [""],
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
    const actionTest: GameActionCreateConsumer = {
      type: "create consumer",
      max: 15,
      rate: 1,
      x: 0,
      y: 0,
      entryDirection: "right",
    };
    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(1);
    const mergerResult = result.entities.get("merger1") as EntityMergerType;
    expect(mergerResult.target).toBe("consumer1");
  });
});
