import { it, expect, describe } from "vitest";
import type { GameType, EntityType } from "../src/types.ts";
import { gameReducer } from "../src/Provider.tsx";

describe("Transport", () => {
  it("deve pegar do estoque quando vazio", () => {
    const stateTest: GameType = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock A",
            val: 2,
            max: 10,
            closed: false,
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            val: 0,
            max: 2,
            rate: 1,
            cooldown: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport A",
            val: 0,
            max: 1,
            rate: 1,
            cooldown: 1,
            source: "stock1",
            target: "consumer1",
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const result = gameReducer(stateTest, { type: "game tick" });
    expect(result.entities.get("stock1")?.val).toBe(1); // estoque diminui
    expect(result.entities.get("transport1")?.val).toBe(1); // transport pega
    expect(result.entities.get("transport1")?.cooldown).toBe(1); // cooldown ativado
  });

  it("deve respeitar cooldown ao pegar do estoque", () => {
    const stateTest: GameType = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock A",
            val: 2,
            max: 10,
            closed: false,
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            val: 0,
            max: 2,
            rate: 1,
            cooldown: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            val: 0,
            max: 1,
            rate: 1,
            cooldown: 2, // começa com cooldown
            source: "stock1",
            target: "consumer1",
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const tick1 = gameReducer(stateTest, { type: "game tick" });
    expect(tick1.entities.get("transport1")?.cooldown).toBe(1);
    expect(tick1.entities.get("transport1")?.val).toBe(0);
    const tick2 = gameReducer(tick1, { type: "game tick" });

    expect(tick2.entities.get("transport1")?.cooldown).toBe(1);
    expect(tick2.entities.get("transport1")?.val).toBe(1); 

    const tick3 = gameReducer(tick2, { type: "game tick" });

    expect(tick3.entities.get("transport1")?.cooldown).toBe(1);
    expect(tick3.entities.get("transport1")?.val).toBe(0);
  });

  it("deve entregar ao consumidor respeitando cooldowns", () => {
    const stateTest: GameType = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock",
            val: 1,
            max: 10,
            closed: false,
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer",
            val: 0,
            max: 2,
            rate: 0.25,
            cooldown: 1,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            val: 1,
            max: 1,
            rate: 1,
            cooldown: 2,
            source: "stock1",
            target: "consumer1",
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const tick1 = gameReducer(stateTest, { type: "game tick" });
    expect(tick1.entities.get("transport1")?.cooldown).toBe(1);
    expect(tick1.entities.get("transport1")?.val).toBe(1);

    const tick2 = gameReducer(tick1, { type: "game tick" });
    expect(tick2.entities.get("transport1")?.cooldown).toBe(1);
    expect(tick2.entities.get("transport1")?.val).toBe(0);
    expect(tick2.entities.get("consumer1")?.val).toBe(1);

  });

  it("não deve entregar ao consumidor quando cheio", () => {
    const stateTest: GameType = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock",
            val: 1,
            max: 10,
            closed: false,
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer",
            val: 2,
            max: 2,
            rate: 1,
            cooldown: 2,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport",
            val: 1,
            max: 1,
            rate: 1,
            cooldown: 1,
            source: "stock1",
            target: "consumer1",
          },
        ],
      ]),
      stocks: ["stock1"],
    };

    const tick1 = gameReducer(stateTest, { type: "game tick" });
    expect(tick1.entities.get("transport1")?.val).toBe(1);
    expect(tick1.entities.get("consumer1")?.val).toBe(2);
    expect(tick1.entities.get("transport1")?.cooldown).toBe(1);
  });
});
