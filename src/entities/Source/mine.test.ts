import { it, expect, describe } from "vitest";
import type { GraphType, NodeSourceType } from "../../types.ts";
import { gameSourceTick, gameReducer } from "../../Provider.tsx";

describe("Source", () => {
  it("should increment value by rate", () => {
    const fakeSource: NodeSourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 0,
    };
    const result = gameSourceTick(fakeSource);
    expect(fakeSource.val).toBe(1);
  });

  it("should not increment when at max", () => {
    const fakeSource: NodeSourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 5,
      max: 5,
      rate: 1,
      cooldown: 0,
    };
    const result = gameSourceTick(fakeSource);
    expect(fakeSource.val).toBe(5);
  });
  it("should not increment when on cooldown", () => {
    const fakeSource: NodeSourceType = {
      id: "source1",
      type: "source",
      name: "Source A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 1.25,
    };
    const result = gameSourceTick(fakeSource);
    expect(fakeSource.val).toBe(0);
  });
  it("should reset cooldown after tick", () => {
    const fakeSource: NodeSourceType = {
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
