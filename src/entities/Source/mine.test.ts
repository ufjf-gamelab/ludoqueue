import { it, expect, describe } from "vitest";
import type { GraphType, NodeMineType } from "../../types.ts";
import { gameMineTick, gameReducer } from "../../Provider.tsx";

describe("Mine", () => {
  it("should increment value by rate", () => {
    const fakeMine: NodeMineType = {
      id: "mine1",
      type: "mine",
      name: "Mine A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 0,
    };
    const result = gameMineTick(fakeMine);
    expect(fakeMine.val).toBe(1);
  });

  it("should not increment when at max", () => {
    const fakeMine: NodeMineType = {
      id: "mine1",
      type: "mine",
      name: "Mine A",
      val: 5,
      max: 5,
      rate: 1,
      cooldown: 0,
    };
    const result = gameMineTick(fakeMine);
    expect(fakeMine.val).toBe(5);
  });
  it("should not increment when on cooldown", () => {
    const fakeMine: NodeMineType = {
      id: "mine1",
      type: "mine",
      name: "Mine A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 1.25,
    };
    const result = gameMineTick(fakeMine);
    expect(fakeMine.val).toBe(0);
  });
  it("should reset cooldown after tick", () => {
    const fakeMine: NodeMineType = {
      id: "mine1",
      type: "mine",
      name: "Mine A",
      val: 0,
      max: 5,
      rate: 1,
      cooldown: 1,
    };
    gameMineTick(fakeMine);
    expect(fakeMine.cooldown).toBe(1/fakeMine.rate);
  });
});
