
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
  leavingDirection: DirectionType;
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

  direction: DirectionType;
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

  entryDirection: DirectionType;
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
  source: string | null;
  target: string | null;

  x: number;
  y: number;
  entryDirection: DirectionType;
  leavingDirection: DirectionType;
  movingGoods: MovingGoodType[];
};

export type MovingGoodType = {
  source: EntityType;
  target: EntityType;
  val: number;
};

export type DirectionType = "up" | "down" | "left" | "right";

export function getInvertedDirection(direction: DirectionType): DirectionType {
  switch (direction) {
    case "down":
      return "up" as DirectionType;
    case "up":
      return "down" as DirectionType;
    case "left":
      return "right" as DirectionType;
    case "right":
      return "left" as DirectionType;
  }
}
