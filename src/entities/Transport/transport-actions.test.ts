import { it, expect, describe } from "vitest";
import type { GameType } from "../../types.ts";
import { gameReducer } from "../../Provider.tsx";
import type { GameActionCreateTransport } from "./TransportActions.ts";
import type { EntityType, EntityTransportType } from "../EntitiesTypes.ts";

describe("Transport should", () => {
  it("create transport1 if none transports exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            goodType: "blue",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "down",
            goods: [],
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 2,
            entryDirection: "up",
            goods: [],
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
      x: 1,
      y: 0,
      entryDirection: "up",
      leavingDirection: "down",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(1);
    expect(result.transports[0]).toBe("transport1");
    expect(result.entities.get("transport1")).toBeDefined();
    expect(result.entities.get("transport1")?.type).toBe("transport");
  });

  it("create transport2 if transport1 already exists", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 2,
            y: 0,
            entryDirection: "left",
            goods: [],
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            name: "Transport 1",
            type: "transport",
            rate: 1,
            max: 10,
            cooldown: 0,
            source: null,
            target: null,
            entryDirection: "left",
            leavingDirection: "right",
            movingGoods: [],
            x: 3,
            y: 0,
            goods: [],
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
      x: 1,
      y: 0,
      entryDirection: "left",
      leavingDirection: "right",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(2);
    expect(result.transports[1]).toBe("transport2");
    expect(result.entities.get("transport2")).toBeDefined();
  });

  /*it("not create transport if source entity does not exist", () => {
  const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x:0,
            y:0,
            entryDirection: "left",
            goods: [],
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
      x:1,
      y:0,
      entryDirection: "left",
      leavingDirection: "right",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(0);
    expect(result.entities.get("transport1")).toBeUndefined();
  });

  it("not create transport if target entity does not exist", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
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
  });*/

  it("create transport with rate 1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            goods: [],
            goodType: "blue",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            goods: [],
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 2,
            y: 0,
            entryDirection: "left",
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
      x: 1,
      y: 0,
      entryDirection: "left",
      leavingDirection: "right",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1") as EntityTransportType;
    expect(transport.source).toBe("source1");
    expect(transport.target).toBe("consumer1");
    expect(transport.rate).toBe(1);
  });

  it("create transport with max 10", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            goodType: "red",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
            goods: [],
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 2,
            y: 0,
            entryDirection: "left",
            goods: [],
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
      x: 1,
      y: 0,
      leavingDirection: "right",
      entryDirection: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1");
    expect(transport?.max).toBe(10);
  });

  it("create transport with source = stock1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock A",
            goods: [],
            max: 5,
            closed: false,
            x: 0,
            y: 0,
            direction: "right",
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            goods: [],
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 2,
            y: 0,
            entryDirection: "left",
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
      x: 1,
      y: 0,
      leavingDirection: "right",
      entryDirection: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1") as EntityTransportType;
    expect(transport?.source).toBe("stock1");
  });

  it("create transport with target = consumer1", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "source1",
          {
            id: "source1",
            type: "source",
            name: "Source A",
            goodType: "red",
            goods: [],
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 0,
            y: 0,
            leavingDirection: "right",
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            goods: [],
            max: 5,
            rate: 1,
            cooldown: 1.25,
            x: 2,
            y: 0,
            entryDirection: "left",
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
      x: 1,
      y: 0,
      leavingDirection: "right",
      entryDirection: "left",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    const transport = result.entities.get("transport1") as EntityTransportType;
    expect(transport?.target).toBe("consumer1");
  });

  it("not create transport if position is ocupied", () => {
    const stateTest: Partial<GameType> = {
      entities: new Map<string, EntityType>([
        [
          "stock1",
          {
            id: "stock1",
            type: "stock",
            name: "Stock A",
            max: 10,
            closed: false,
            goods: [],
            direction: "right",
            x: 0,
            y: 0,
          },
        ],
        [
          "consumer1",
          {
            id: "consumer1",
            type: "consumer",
            name: "Consumer A",
            max: 2,
            rate: 1,
            cooldown: 0,
            goods: [],
            entryDirection: "left",
            x: 2,
            y: 0,
          },
        ],
        [
          "transport1",
          {
            id: "transport1",
            type: "transport",
            name: "Transport A",
            max: 1,
            rate: 1,
            cooldown: 1,
            source: "stock1",
            target: "consumer1",
            x: 1,
            y: 0,
            entryDirection: "left",
            leavingDirection: "right",
            movingGoods: [],
            goods: [],
          },
        ],
      ]),
      stocks: ["stock1"],
      consumers: ["consumer1"],
      transports: ["transport1"],
    };

    const actionTest: GameActionCreateTransport = {
      type: "create transport",
      rate: 1,
      max: 10,
      x: 1,
      y: 0,
      entryDirection: "left",
      leavingDirection: "right",
    };

    const result = gameReducer(stateTest as GameType, actionTest);
    expect(result.transports).toHaveLength(1);
  });
});
