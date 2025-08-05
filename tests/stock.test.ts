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
      nodes: [fakeStock],
      links: [],
    };
    const result = gameReducer(stateTest as GraphType, { type: "game tick" });
    expect(result.nodes[0].val).toBe(2);
    expect((result.nodes[0] as NodeStockType).closed).toBe(false);
  });
});
