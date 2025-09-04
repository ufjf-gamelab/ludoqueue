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
  cooldown: number
};

export type EntityStockType = {
  id: string;
  name: string;
  type: "stock";
  val: number;
  max: number;
  closed: boolean;
};

export type EntityConsumerType = {
  id: string;
  name: string;
  type: "consumer";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
};

export type EntityTransportType = {
  id: string;
  name: string;
  type: "transport";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
  source: string;
  target: string;
};
