import type { DirectionType, GoodType } from "../entities/EntitiesTypes";

export type GameActionEditorChangeMax = {
  type: "editor change max";
  max: number;
};

export type GameActionEditorChangeRate = {
  type: "editor change rate";
  rate: number;
};

export type GameActionEditorChangeDirection = {
  type: "editor change direction";
  direction: DirectionType;
};

export type GameActionEditorChangeEntryDirection = {
  type: "editor change entry direction";
  entryDirection: DirectionType;
};

export type GameActionEditorChangeLeavingDirection = {
  type: "editor change leaving direction";
  leavingDirection: DirectionType;
};

export type GameActionEditorChangeVal = {
  type: "editor change val";
  value: number;
};

export type GameActionEditorChangeGoodType = {
  type: "editor change good type";
  goodType: string;
};

export type GameActionEditorChangeRecipeInput = {
  type: "editor change recipe input";
  entry: [GoodType, number];
}

export type GameActionEditorChangeRecipeOutput = {
  type: "editor change recipe output";
  entry: [GoodType, number];
}
