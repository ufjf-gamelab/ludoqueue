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
