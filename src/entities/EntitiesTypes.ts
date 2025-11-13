import type { TransportDirection } from "./Transport/TransportActions";

export type EntityType =
  | EntitySourceType
  | EntityStockType
  | EntityConsumerType
  | EntityTransportType;

export type EntitySourceType = {
  id: string;
  name: string;
  type: "source";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
  x: number;
  y: number;
};

export type EntityStockType = {
  id: string;
  name: string;
  type: "stock";
  val: number;
  max: number;
  closed: boolean;

  x: number;
  y: number;
};

export type EntityConsumerType = {
  id: string;
  name: string;
  type: "consumer";
  val: number;
  max: number;
  rate: number;
  cooldown: number;

  x: number;
  y: number;
};

export type EntityTransportType = {
  id: string;
  name: string;
  type: "transport";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
  source: string | undefined;
  target: string | undefined;

  x: number;
  y: number;
  direction: TransportDirection;
  movingGoods: MovingGoodType[];
};

export type MovingGoodType = {
  source: EntityType, 
  target: EntityType,
  val: number,
}
