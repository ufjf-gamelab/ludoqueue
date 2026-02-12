import type { DirectionType } from "../entities/EntitiesTypes";

export type GameEditor = GameStockEditor | GameConsumerEditor | null;

export type GameStockEditor = {
  type: "stock";
  max: number;
  val: number;
  direction: DirectionType;
}

export type GameConsumerEditor = {
  type: "consumer";
  max: number;
  rate: number;
}
