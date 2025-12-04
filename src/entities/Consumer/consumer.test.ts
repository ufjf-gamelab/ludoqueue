import { it, expect, describe } from "vitest";
import type { GameType } from "../../types";
import { gameConsumerTick, gameReducer } from "../../Provider";
import type {
  GameActionCreateConsumer,
  GameActionDeleteConsumer,
} from "./ConsumerActions";
import type { EntityType, EntityConsumerType } from "../EntitiesTypes";

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
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
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
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
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
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(2);
    expect((result.entities.get("consumer2") as EntityConsumerType).max).toBe(
      15
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
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
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
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.consumers).toHaveLength(2);
    expect((result.entities.get("consumer2") as EntityConsumerType).rate).toBe(
      1
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
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
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
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
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
            val: 5,
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            entryDirection: "left",
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

  it("should decrease value by rate", () => {
    const fakeCosumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 1,
      max: 2,
      rate: 1,
      cooldown: 0,
      x: 0,
      y: 0,
      entryDirection: "left",
    };
    gameConsumerTick(fakeCosumer);
    expect(fakeCosumer.val).toBe(0);
  });

  it("should not decrease below zero", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 0,
      max: 2,
      rate: 1,
      cooldown: 0,
      x: 0,
      y: 0,
      entryDirection: "left",
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.val).toBe(0);
  });

  it("should not decrease when on cooldown", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 1,
      max: 2,
      rate: 1,
      cooldown: 2,
      x: 0,
      y: 0,
      entryDirection: "left",
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.val).toBe(1);
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.val).toBe(0);
  });

  it("should reset cooldown after tick", () => {
    const fakeConsumer: EntityConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 1,
      max: 2,
      rate: 1,
      cooldown: 2,
      x: 0,
      y: 0,
      entryDirection: "left",
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.cooldown).toBe(1);
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.cooldown).toBe(1);
  });
});
