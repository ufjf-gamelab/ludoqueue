import { it, expect, describe } from "vitest";
import type { GraphType } from "../src/types.ts";
import { gameReducer } from "../src/Provider.tsx";

describe("Testando gameTick (Usando gameReducer)", async () => {
  //devo testar direto no gameTick?
  //teste de funções de cada nó
  it("Mina deve somar 1", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "mine1",
          name: "Mine 1",
          type: "mine",
          val: 0,
          max: 5,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [],
    };
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(1);
  });
  it("Mina não deve somar estando no máximo", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "mine1",
          name: "Mine 1",
          type: "mine",
          val: 5,
          max: 5,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [],
    };
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(5);
  });
  it("Consumer deve diminuir 1", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "consumer1",
          name: "Consumer 1",
          type: "consumer",
          val: 1,
          max: 2,
          rate: 0.8,
          cooldown: 0,
        },
      ],
      links: [],
    };
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(0);
  });
  it("Stock deve manter os itens", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "stock1",
          name: "Stock 1",
          type: "stock",
          val: 2,
          max: 10,
          closed: false,
        },
      ],
      links: [],
    };
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(2);
  });

  //testando transport em geral abaixo

  it("Transport deve obter de stock se estiver vazio", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "stock1",
          name: "Stock 1",
          type: "stock",
          val: 2,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          name: "Consumer 1",
          type: "consumer",
          val: 0,
          max: 2,
          rate: 0.8,
          cooldown: 0,
        },

        {
          id: "transport1",
          name: "Transport 1",
          type: "transport",
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
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(1);
    expect(result.nodes[1].val).toBe(0);
    expect(result.nodes[2].val).toBe(1);
  });
  it("Transport não deve obter de stock se estiver cheio", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "stock1",
          name: "Stock 1",
          type: "stock",
          val: 2,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          name: "Consumer 1",
          type: "consumer",
          val: 0,
          max: 2,
          rate: 0.8,
          cooldown: 0,
        },

        {
          id: "transport1",
          name: "Transport 1",
          type: "transport",
          val: 1,
          max: 1,
          rate: 1,
          cooldown: 0,
        },
      ],
      links: [
        { source: "stock1", target: "transport1"},
        //{ source: "transport1", target: "consumer1" },
      ],
    };
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(2);
    expect(result.nodes[2].val).toBe(1);
  });
  it("Transport deve levar ao consumer se estiver cheio", () => {
    const stateTest: GraphType = {
      nodes: [
        {
          id: "stock1",
          name: "Stock 1",
          type: "stock",
          val: 2,
          max: 10,
          closed: false,
        },
        {
          id: "consumer1",
          name: "Consumer 1",
          type: "consumer",
          val: 0,
          max: 2,
          rate: 0.8,
          cooldown: 0,
        },

        {
          id: "transport1",
          name: "Transport 1",
          type: "transport",
          val: 1,
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
    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.nodes[0].val).toBe(2);
    expect(result.nodes[1].val).toBe(1);
    expect(result.nodes[2].val).toBe(0);
  });
});
