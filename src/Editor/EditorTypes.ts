import type { DirectionType } from "../entities/EntitiesTypes";

export type GameEditor = GameStockEditor | GameConsumerEditor | GameSourceEditor | null;

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
  entryDirection: DirectionType;
}

export type GameSourceEditor = {
  type: "source";
  max: number;
  rate: number;
  leavingDirection: DirectionType;
}
