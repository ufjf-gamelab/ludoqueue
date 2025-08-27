import { it, expect, describe } from "vitest";
import type { GameType, EntityType, EntityTransportType } from "../../types.ts";
import { gameReducer } from "../../Provider.tsx";
import type { GameActionCreateTransport } from "./TransportActions.ts";

describe("Transport", () => {
  it("should create transport1 if none transports exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
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
          },
        ],
      ]),
      sources: ["source1"],
      consumers: ["consumer1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "source1",
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(1);
    expect(result.transports[0]).toBe("transport1");
    expect(result.entities.get("transport1")).toBeDefined();
    expect(result.entities.get("transport1")?.type).toBe("transport");
  });

  it("should create transport2 if transport1 already exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
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
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            name: "Transport 1",
            type: "transport",
            val: 0,
            rate: 1,
            max: 10,
            cooldown: 0,
            source: "source1",
            target: "consumer1",
          },
        ],
      ]),
      sources: ["source1"],
      consumers: ["consumer1"],
      transports: ["transport1"],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "source1",
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(2);
    expect(result.transports[1]).toBe("transport2");
    expect(result.entities.get("transport2")).toBeDefined();
  });

  it("should not create transport if source entity does not exist", () => {
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
          },
        ],
      ]),
      consumers: ["consumer1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "source1", // não existe
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(0);
    expect(result.entities.get("transport1")).toBeUndefined();
  });

  it("should not create transport if target entity does not exist", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
      ]),
      sources: ["source1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "source1",
      target: "consumer1", // não existe
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(0);
    expect(result.entities.get("transport1")).toBeUndefined();
  });

  it("should create transport with rate 1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
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
          },
        ],
      ]),
      sources: ["source1"],
      consumers: ["consumer1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "source1",
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1") as EntityTransportType;
    expect(transport.rate).toBe(1);
  });

  it("should create transport with max 10", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
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
          },
        ],
      ]),
      sources: ["source1"],
      consumers: ["consumer1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 2,
      max: 10,
      source: "source1",
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1");
    expect(transport?.max).toBe(10);
  });

  it("should create transport with source = stock1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock A",
            val: 0,
            max: 5,
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
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
      ]),
      sources: ["stock1"],
      consumers: ["consumer1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "stock1",
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1") as EntityTransportType;
    expect(transport?.source).toBe("stock1");
  });

  it("should create transport with target = consumer1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            val: 0,
            max: 5,
            rate: 1,
            cooldown: 1.25,
          },
        ],
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
          },
        ],
      ]),
      sources: ["source1"],
      consumers: ["consumer1"],
      transports: [],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      source: "source1",
      target: "consumer1",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1") as EntityTransportType;
    expect(transport?.target).toBe("consumer1");
  });

  it("deve pegar do estoque quando vazio", () => {
    const stateTest: Partial<GameType> = {
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
            target: "transport1",
          },
        ],
      ]),
      stocks: ["stock1"],
      consumers: ["consumer1"],
      transports: ["transport1"],
    };

    const result = gameReducer(stateTest as GameType, { type: "game tick" });
    expect(result.entities.get("stock1")?.val).toBe(1); // estoque diminui
    const transport = result.entities.get("transport1") as EntityTransportType
    expect(transport.val).toBe(1); // transport pega
    expect(transport.cooldown).toBe(1); // cooldown ativado
  });

  it("deve respeitar cooldown ao pegar do estoque", () => {
    const stateTest: Partial<GameType> = {
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
            cooldown: 2,
            source: "stock1",
            target: "consumer1",
          },
        ],
      ]),
      stocks: ["stock1"],
      consumers: ["consumer1"],
      transports: ["transport1"],
    };

    const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
    const transportTick1 = tick1.entities.get("transport1") as EntityTransportType; 
    expect(transportTick1?.cooldown).toBe(1);
    expect(transportTick1?.val).toBe(0);

    const tick2 = gameReducer(tick1, { type: "game tick" });
    const transportTick2 = tick2.entities.get("transport1") as EntityTransportType; 
    expect(transportTick2?.cooldown).toBe(1);
    expect(transportTick2?.val).toBe(1);

    const tick3 = gameReducer(tick2, { type: "game tick" });
    const transportTick3 = tick3.entities.get("transport1") as EntityTransportType; 
    expect(transportTick3?.cooldown).toBe(1);
    expect(transportTick3?.val).toBe(0);
  });

  it("deve entregar ao consumidor respeitando cooldowns", () => {
    const stateTest: Partial<GameType> = {
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
      consumers: ["consumer1"],
      transports: ["transport1"],
    };

    const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
    const transportTick1 = tick1.entities.get("transport1") as EntityTransportType; 
    expect(transportTick1?.cooldown).toBe(1);
    expect(transportTick1?.val).toBe(1);

    const tick2 = gameReducer(tick1, { type: "game tick" });
    const transportTick2 = tick2.entities.get("transport1") as EntityTransportType; 

    expect(transportTick2?.cooldown).toBe(1);
    expect(transportTick2?.val).toBe(0);
  });

  it("não deve entregar ao consumidor quando cheio", () => {
    const stateTest: Partial<GameType> = {
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
            val: 2,
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
            name: "Transport A",
            val: 1,
            max: 1,
            rate: 1,
            cooldown: 1,
            source: "stock1",
            target: "transport1",
          },
        ],
      ]),
      stocks: ["stock1"],
      consumers: ["consumer1"],
      transports: ["transport1"],
    };
    const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
    const transportTick1 = tick1.entities.get("transport1") as EntityTransportType;
    expect(transportTick1?.val).toBe(1);
    expect(transportTick1?.cooldown).toBe(1);
  });
});
