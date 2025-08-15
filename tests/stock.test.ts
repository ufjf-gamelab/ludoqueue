import { it, expect, describe } from "vitest";
import type { GraphType, NodeStockType } from "../src/types.ts";
import { gameReducer } from "../src/Provider.tsx";

describe("Stock", () => {
  it("should keep items unchanged", () => {
    const fakeStock: NodeStockType = {
      id: "stock1",
      type: "stock",
      name: "Stock A",
      max: 10,
      val: 2,
      closed: false,
    };
    const stateTest: Partial<GraphType> = {
      nodes: [fakeStock]
    };
    const result = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(result.nodes[0].val).toBe(2);
    expect((result.nodes[0] as NodeStockType).closed).toBe(false);
  });

  it("should not get items if full", () => {
    const stateTest: Partial<GraphType> = {
      nodes: [
        {
          id: "stock1",
          type: "stock",
          name: "Stock",
          val: 10,
          max: 10,
          closed: false,
        },
        {
          id: "mine1",
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
          val: 1,
          max: 1,
          rate: 1,
          cooldown: 0,
          source:"mine1",
          target:"stock1"
        },
      ],
    };
    const result = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(result.nodes[0].val).toBe(10);
    expect((result.nodes[0] as NodeStockType).closed).toBe(false);
  });

  it("should not get items if closed", () => {
    const stateTest: Partial<GraphType> = {
      nodes: [
        {
          id: "stock1",
          type: "stock",
          name: "Stock",
          val: 2,
          max: 10,
          closed: true,
        },
        {
          id: "mine1",
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
          source:"mine1",
          target:"stock1"
        },
      ],
    };
    const tick1 = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(tick1.nodes[2].val).toBe(1);
    expect(tick1.nodes[2].cooldown).toBe(1);
    const tick2 = gameReducer(tick1, { type: "game tick" });
    expect(tick2.nodes[2].val).toBe(1);
    expect(tick2.nodes[2].cooldown).toBe(0);
    const tick3 = gameReducer(tick2, { type: "game tick" });
    expect(tick3.nodes[2].val).toBe(1);
    expect(tick3.nodes[2].cooldown).toBe(1);
    expect(tick3.nodes[0].val).toBe(2);
    expect((tick3.nodes[0] as NodeStockType).closed).toBe(true);
  });
});
