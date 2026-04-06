
export type EntityType =
  | EntitySourceType
  | EntityStockType
  | EntityConsumerType
  | EntityTransportType
  | EntitySplitterType
  | EntityMergerType
  | EntityExchangerType;

export type EntitySourceType = {
  id: string;
  name: string;
  type: "source";
  goodType: GoodType;
  max: number;
  rate: number;
  cooldown: number;
  leavingDirection: DirectionType;
  x: number;
  y: number;
  goods: MovingGoodType[];
};

export type EntityStockType = {
  id: string;
  name: string;
  type: "stock";
  max: number;
  closed: boolean;
  goods: MovingGoodType[];
  direction: DirectionType;
  x: number;
  y: number;
};

export type EntityConsumerType = {
  id: string;
  name: string;
  type: "consumer";
  max: number;
  rate: number;
  cooldown: number;
  goods: MovingGoodType[];
  entryDirection: DirectionType;
  x: number;
  y: number;
};

export type EntitySplitterType = {
  id: string;
  name: string;
  type: "splitter";
  max: number;
  rate: number;
  cooldown: number;
  entryDirection: DirectionType;
  x: number;
  y: number;
  source: string | null;
  targets: string[];
  nextTargetIndex: number;
  movingGoods: MovingGoodType[];
  goods: MovingGoodType[];
};

export type EntityTransportType = {
  id: string;
  name: string;
  type: "transport";
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
  goods: MovingGoodType[];
};

export type EntityMergerType = {
  id: string;
  name: string;
  type: "merger";
  max: number;
  rate: number;
  cooldown: number;
  leavingDirection: DirectionType;
  x: number;
  y: number;
  target: string | null;
  sources: string[];
  nextSourceIndex: number;
  movingGoods: MovingGoodType[];
  goods: MovingGoodType[];
}

export type EntityExchangerType = {
  id: string;
  name: string;
  type: "exchanger";
  recipe: RecipeType;
  direction: DirectionType;
  source: string | null;
  target: string | null;
  x: number;
  y: number;
  goods: MovingGoodType[];
  movingGoods: MovingGoodType[];
}

export type RecipeType = {
  input: [GoodType, number][];
  output: [GoodType, number][];
}

export type MovingGoodType = {
  source: string|null;
  target: string|null;
  size: number;
  time: number;
  goodType: GoodType;
};

export type GoodType = "red" | "blue" | "green";

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
