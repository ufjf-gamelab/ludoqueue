import { it, expect, describe } from "vitest";
import type { GraphType } from "../src/types.ts";
import { gameReducer } from "../src/Provider.tsx";

describe("Transport", () => {
  it("should get from stock if transport is empty", () => {
    const stateTest: Partial<GraphType> = {
      nodes: [
        {
          id: "stock1",
          type: "stock",
          name: "Stock A",
          val: 2,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          type: "consumer",
          name: "Consumer A",
          val: 0,
          max: 2,
          rate: 1,
          cooldown: 0,
        },
        {
          id: "transport1",
          type: "transport",
          name: "Transport A",
          val: 0,
          max: 1,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [
        { source: "stock1", target: "transport1" },
        { source: "transport1", target: "consumer1" },
      ],
    };
    const result = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(result.nodes[0].val).toBe(1);
    expect(result.nodes[1].val).toBe(0);
    expect(result.nodes[2].val).toBe(1);
  });

  it("should not get from stock if transport is full", () => {
    const stateTest: Partial<GraphType> = {
      nodes: [
        {
          id: "stock1",
          type: "stock",
          name: "Stock A",
          val: 2,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          type: "consumer",
          name: "Consumer A",
          val: 0,
          max: 2,
          rate: 1,
          cooldown: 0,
        },
        {
          id: "transport1",
          type: "transport",
          name: "Transport",
          val: 1,
          max: 1,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [{ source: "stock1", target: "transport1" }],
    };
    const result = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(result.nodes[0].val).toBe(2);
    expect(result.nodes[2].val).toBe(1);
  });

  it("should deliver to consumer if it isn't full", () => {
    const stateTest: Partial<GraphType> = {
      nodes: [
        {
          id: "stock1",
          type: "stock",
          name: "Stock",
          val: 1,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          type: "consumer",
          name: "Consumer",
          val: 0,
          max: 2,
          rate: 1,
          cooldown: 0,
        },
        {
          id: "transport1",
          type: "transport",
          name: "Transport",
          val: 0,
          max: 1,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [
        { source: "stock1", target: "transport1" },
        { source: "transport1", target: "consumer1" },
      ],
    };
    expect(stateTest.nodes![0].val).toBe(1);
    expect(stateTest.nodes![1].val).toBe(0);
    expect(stateTest.nodes![2].val).toBe(0);
    const tick1 = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(tick1.nodes[0].val).toBe(0);
    expect(tick1.nodes[1].val).toBe(1);
    expect(tick1.nodes[2].val).toBe(0);
    const tick2 = gameReducer(tick1 as GraphType, { type: "game tick" });
    expect(tick2.nodes[0].val).toBe(0);
    expect(tick2.nodes[1].val).toBe(0);
    expect(tick2.nodes[2].val).toBe(1);
  });
  it("should not deliver to consumer if it is full", () => {
    const stateTest: Partial<GraphType> = {
      nodes: [
        {
          id: "stock1",
          type: "stock",
          name: "Stock",
          val: 1,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          type: "consumer",
          name: "Consumer",
          val: 2,
          max: 2,
          rate: 1,
          cooldown: 0,
        },
        {
          id: "transport1",
          type: "transport",
          name: "Transport",
          val: 0,
          max: 1,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [
        { source: "stock1", target: "transport1" },
        { source: "transport1", target: "consumer1" },
      ],
    };
    const result = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(result.nodes[0].val).toBe(1);
    expect(result.nodes[1].val).toBe(2);
    expect(result.nodes[2].val).toBe(0);
  });
});
