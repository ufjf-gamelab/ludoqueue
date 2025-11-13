import { it, expect, describe } from "vitest";
import type { GameType } from "../../types";
import type { EntityTransportType, EntityType } from "../EntitiesTypes";
import { gameReducer } from "../../Provider";

describe("In a single transport connection between", () => {
  describe("source → consumer", () => {
    it("it should get from source", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 1,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };

      const result = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport = result.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport.val).toBe(1);
      expect(transport.cooldown).toBe(1);
    });

    it("it shouldn't get from a source on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(1);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transportTick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick3?.cooldown).toBe(1);
      expect(transportTick3?.val).toBe(0);
    });

    it("it should deliver respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(0);
    });

    it("shouldn't deliver if consumer is full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 2,
              max: 2,
              rate: 1,
              cooldown: 1,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };
      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.val).toBe(1);
      expect(transportTick1?.cooldown).toBe(1);
    });
  });

  describe("source → stock", () => {
    it("it should get from source", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 0,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        stocks: ["stock2"],
        transports: ["transport1"],
      };

      const result = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport = result.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport.val).toBe(1);
      expect(transport.cooldown).toBe(1);
    });

    it("it shouldn't get from a source on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 0,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        stocks: ["stock2"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(1);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transportTick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick3?.cooldown).toBe(1);
      expect(transportTick3?.val).toBe(0);
    });

    it("it should deliver respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 0,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        stocks: ["stock2"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(0);
    });

    it("shouldn't deliver if stock is full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 5,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        stocks: ["stock2"],
        transports: ["transport1"],
      };
      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.val).toBe(1);
      expect(transportTick1?.cooldown).toBe(1);
    });
  });

  describe("stock → consumer", () => {
    it("it should get from stock", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 2,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "stock1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };

      const result = gameReducer(stateTest as GameType, { type: "game tick" });
      expect(result.entities.get("stock1")?.val).toBe(1);
      const transport = result.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport.val).toBe(1);
      expect(transport.cooldown).toBe(1);
    });

    it("it shouldn't get from a stock on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 2,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "stock1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(1);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transportTick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick3?.cooldown).toBe(1);
      expect(transportTick3?.val).toBe(0);
    });

    it("it should deliver respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 2,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "stock1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(0);
    });

    it("shouldn't deliver if consumer is full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 2,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 2,
              max: 2,
              rate: 1,
              cooldown: 1,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "stock1",
              target: "consumer1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1"],
        consumers: ["consumer1"],
        transports: ["transport1"],
      };
      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.val).toBe(1);
      expect(transportTick1?.cooldown).toBe(1);
    });
  });

  describe("stock → stock", () => {
    it("it should get from source stock", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 3,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 1,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "stock1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1", "stock2"],
        transports: ["transport1"],
      };

      const result = gameReducer(stateTest as GameType, { type: "game tick" });
      expect(result.entities.get("stock1")?.val).toBe(2);
      const transport = result.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport.val).toBe(1);
      expect(transport.cooldown).toBe(1);
    });

    it("it shouldn't get from stock on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 3,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 1,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "stock1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1", "stock2"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(1);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transportTick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick3?.cooldown).toBe(1);
      expect(transportTick3?.val).toBe(0);
    });

    it("it should deliver respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 3,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 1,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "stock1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1", "stock2"],
        transports: ["transport1"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.cooldown).toBe(1);
      expect(transportTick1?.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transportTick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick2?.cooldown).toBe(1);
      expect(transportTick2?.val).toBe(0);
    });

    it("shouldn't deliver if target stock is full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "stock1",
            {
              id: "stock1",
              type: "stock",
              name: "Stock 1",
              val: 3,
              max: 10,
              closed: false,
              x: 0,
              y: 0,
            },
          ],
          [
            "stock2",
            {
              id: "stock2",
              type: "stock",
              name: "Stock 2",
              val: 5,
              max: 5,
              closed: false,
              x: 2,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "stock1",
              target: "stock2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        stocks: ["stock1", "stock2"],
        transports: ["transport1"],
      };
      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transportTick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transportTick1?.val).toBe(1);
      expect(transportTick1?.cooldown).toBe(1);
    });
  });
});

describe("In a double transport connection between", () => {
  describe("source → transport1 → transport2 → consumer", () => {
    it("transport1 should get from source", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1.val).toBe(1);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(0);
      expect(transport2Tick1?.cooldown).toBe(1);
    });

    it("transport1 shouldn't get from source while on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(0);
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(0);
    });

    it("transport1 shouldn't deliver to transport2 if on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(1);
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick2?.cooldown).toBe(1);
      expect(transport1Tick2?.val).toBe(0);
      expect(transport2Tick2?.cooldown).toBe(1);
      expect(transport2Tick2?.val).toBe(1);
    });

    it("transport1 shouldn't deliver to transport2 if its full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 2, //should be on cooldown to simulate being full after one tick
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(1);
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick2?.cooldown).toBe(1);
      expect(transport1Tick2?.val).toBe(1);
      expect(transport2Tick2?.cooldown).toBe(1);
      expect(transport2Tick2?.val).toBe(0);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick3?.cooldown).toBe(1);
      expect(transport1Tick3?.val).toBe(0);
      expect(transport2Tick3?.cooldown).toBe(1);
      expect(transport2Tick3?.val).toBe(1);
    });

    it("transport1 should deliver to transport2 respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              movingGoods: [],

              direction: "right",
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(0);
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick2?.cooldown).toBe(1);
      expect(transport1Tick2?.val).toBe(1);
      expect(transport2Tick2?.cooldown).toBe(1);
      expect(transport2Tick2?.val).toBe(0);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick3?.cooldown).toBe(1);
      expect(transport1Tick3?.val).toBe(0);
      expect(transport2Tick3?.cooldown).toBe(1);
      expect(transport2Tick3?.val).toBe(1);
    });

    /* it("transport2 should wait for transport1 to deliver", () => { // comportamento de esteira
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };
      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(1);
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick2?.cooldown).toBe(1);
      expect(transport1Tick2?.val).toBe(0);
      expect(transport2Tick2?.cooldown).toBe(1);
      expect(transport2Tick2?.val).toBe(1);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick3?.cooldown).toBe(1);
      expect(transport1Tick3?.val).toBe(1);
      expect(transport2Tick3?.cooldown).toBe(1);
      expect(transport2Tick3?.val).toBe(0);
    });*/

    it("transport2 should deliver to consumer respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(0);
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick2?.cooldown).toBe(1);
      expect(transport1Tick2?.val).toBe(1);
      expect(transport2Tick2?.cooldown).toBe(1);
      expect(transport2Tick2?.val).toBe(0);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick3?.cooldown).toBe(1);
      expect(transport1Tick3?.val).toBe(0);
      expect(transport2Tick3?.cooldown).toBe(1);
      expect(transport2Tick3?.val).toBe(1);

      const tick4 = gameReducer(tick3, { type: "game tick" });
      const transport1Tick4 = tick4.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick4 = tick4.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick4?.cooldown).toBe(1);
      expect(transport1Tick4?.val).toBe(1);
      expect(transport2Tick4?.cooldown).toBe(1);
      expect(transport2Tick4?.val).toBe(0);

      const tick5 = gameReducer(tick4, { type: "game tick" });
      const transport1Tick5 = tick5.entities.get(
        "transport1"
      ) as EntityTransportType;
      const transport2Tick5 = tick5.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport1Tick5?.cooldown).toBe(1);
      expect(transport1Tick5?.val).toBe(0);
      expect(transport2Tick5?.cooldown).toBe(1);
      expect(transport2Tick5?.val).toBe(1);
    });

    it("transport2 shouldn't deliver to consumer if its full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 2,
              max: 2,
              rate: 1,
              cooldown: 1,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport2",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport1",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport2Tick1?.cooldown).toBe(1);
      expect(transport2Tick1?.val).toBe(1);
      expect(tick1.entities.get("consumer1")?.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      expect(transport2Tick2?.cooldown).toBe(1);
      expect(transport2Tick2?.val).toBe(0);
      expect(tick2.entities.get("consumer1")?.val).toBe(1);
    });
  });
  describe("source → transport2 → transport1 → consumer", () => {
    it("transport2 should get from source", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map<string, EntityType>([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.val).toBe(1);
      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(0);
      expect(transport1Tick1.cooldown).toBe(1);
    });

    it("transport2 shouldn't get from source while on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport2Tick1.val).toBe(0);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(0);
    });

    it("transport2 shouldn't deliver to transport1 if on cooldown", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport2Tick1.val).toBe(1);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick2.cooldown).toBe(1);
      expect(transport2Tick2.val).toBe(0);
      expect(transport1Tick2.cooldown).toBe(1);
      expect(transport1Tick2.val).toBe(1);
    });

    it("transport2 shouldn't deliver to transport1 if transport1 is full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport2Tick1.val).toBe(1);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(1);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick2.cooldown).toBe(1);
      expect(transport2Tick2.val).toBe(1);
      expect(transport1Tick2.cooldown).toBe(1);
      expect(transport1Tick2.val).toBe(0);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick3.cooldown).toBe(1);
      expect(transport2Tick3.val).toBe(0);
      expect(transport1Tick3.cooldown).toBe(1);
      expect(transport1Tick3.val).toBe(1);
    });

    it("transport2 should deliver to transport1 respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport2Tick1.val).toBe(0);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick2.cooldown).toBe(1);
      expect(transport2Tick2.val).toBe(1);
      expect(transport1Tick2.cooldown).toBe(1);
      expect(transport1Tick2.val).toBe(0);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick3.cooldown).toBe(1);
      expect(transport2Tick3.val).toBe(0);
      expect(transport1Tick3.cooldown).toBe(1);
      expect(transport1Tick3.val).toBe(1);
    });

    /*it("transport1 should wait for transport2 to deliver", () => { //comportamento de esteira
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 2,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport2Tick1.val).toBe(1);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick2.cooldown).toBe(1);
      expect(transport2Tick2.val).toBe(0);
      expect(transport1Tick2.cooldown).toBe(1);
      expect(transport1Tick2.val).toBe(1);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport2Tick3 = tick3.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick3.cooldown).toBe(1);
      expect(transport2Tick3.val).toBe(1);
      expect(transport1Tick3.cooldown).toBe(1);
      expect(transport1Tick3.val).toBe(0);
    });*/

    it("transport1 should deliver to consumer respecting cooldowns", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 0,
              max: 2,
              rate: 1,
              cooldown: 0,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 0.5,
              cooldown: 2,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 0,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport2Tick1 = tick1.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick1.cooldown).toBe(1);
      expect(transport2Tick1.val).toBe(0);
      expect(transport1Tick1.cooldown).toBe(1);
      expect(transport1Tick1.val).toBe(0);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport2Tick2 = tick2.entities.get(
        "transport2"
      ) as EntityTransportType;
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;

      expect(transport2Tick2.cooldown).toBe(2);
      expect(transport2Tick2.val).toBe(1);
      expect(transport1Tick2.cooldown).toBe(1);
      expect(transport1Tick2.val).toBe(0);

      const tick3 = gameReducer(tick2, { type: "game tick" });
      expect(tick3.entities.get("consumer1")?.val).toBe(0);
    });

    it("transport1 shouldn't deliver to consumer if its full", () => {
      const stateTest: Partial<GameType> = {
        entities: new Map([
          [
            "source1",
            {
              id: "source1",
              type: "source",
              name: "Source 1",
              val: 2,
              max: 10,
              rate: 1,
              cooldown: 0,
              x: 0,
              y: 0,
            },
          ],
          [
            "consumer1",
            {
              id: "consumer1",
              type: "consumer",
              name: "Consumer 1",
              val: 2,
              max: 2,
              rate: 1,
              cooldown: 2,
              x: 4,
              y: 0,
            },
          ],
          [
            "transport2",
            {
              id: "transport2",
              type: "transport",
              name: "Transport 2",
              val: 0,
              max: 1,
              rate: 0.5,
              cooldown: 2,
              source: "source1",
              target: "transport1",
              x: 1,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
          [
            "transport1",
            {
              id: "transport1",
              type: "transport",
              name: "Transport 1",
              val: 1,
              max: 1,
              rate: 1,
              cooldown: 1,
              source: "transport2",
              target: "consumer1",
              x: 3,
              y: 0,
              direction: "right",
              movingGoods: [],
            },
          ],
        ]),
        sources: ["source1"],
        consumers: ["consumer1"],
        transports: ["transport1", "transport2"],
      };

      const tick1 = gameReducer(stateTest as GameType, { type: "game tick" });
      const transport1Tick1 = tick1.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport1Tick1?.cooldown).toBe(1);
      expect(transport1Tick1?.val).toBe(1);
      expect(tick1.entities.get("consumer1")?.val).toBe(2);

      const tick2 = gameReducer(tick1, { type: "game tick" });
      const transport1Tick2 = tick2.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport1Tick2?.cooldown).toBe(1);
      expect(transport1Tick2?.val).toBe(1);
      expect(tick2.entities.get("consumer1")?.val).toBe(1);
    
    const tick3 = gameReducer(tick2, { type: "game tick" });
      const transport1Tick3 = tick3.entities.get(
        "transport1"
      ) as EntityTransportType;
      expect(transport1Tick3?.cooldown).toBe(1);
      expect(transport1Tick3?.val).toBe(0);
      expect(tick3.entities.get("consumer1")?.val).toBe(1);
    });
  });
});
