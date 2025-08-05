import { it, expect, describe } from "vitest";
import type { GraphType, NodeConsumerType } from "../src/types.ts";
import { gameConsumerTick } from "../src/Provider.tsx";

describe("Consumer", () => {
  it("should decrease value by rate", () => {
    const fakeCosumer: NodeConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 1,
      max: 2,
      rate: 1,
      cooldown: 0,
    };
    gameConsumerTick(fakeCosumer);
    expect(fakeCosumer.val).toBe(0);
  });

  it("should not decrease below zero", () => {
    const fakeConsumer: NodeConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 0,
      max: 2,
      rate: 1,
      cooldown: 0,
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.val).toBe(0);
  });

  it("should not decrease when on cooldown", () => {
    const fakeConsumer: NodeConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 1,
      max: 2,
      rate: 1,
      cooldown: 1,
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.val).toBe(1);
  });

  it("should reset cooldown after tick", () => {
    const fakeConsumer: NodeConsumerType = {
      id: "consumer1",
      type: "consumer",
      name: "Consumer A",
      val: 1,
      max: 2,
      rate: 1,
      cooldown: 1,
    };
    gameConsumerTick(fakeConsumer);
    expect(fakeConsumer.cooldown).toBe(0);
  });
});
