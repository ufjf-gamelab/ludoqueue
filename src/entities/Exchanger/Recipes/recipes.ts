import type { RecipeType } from "../../EntitiesTypes";

export const recipe1: RecipeType = {
  name: "Recipe 1",
  input: [
    ["red", 2],
    ["blue", 1],
    ["green", 0],
  ],
  output: [
    ["red", 0],
    ["blue", 0],
    ["green", 1],
  ],
};

export const recipe2: RecipeType = {
  name: "Recipe 2",
  input: [
    ["red", 1],
    ["blue", 1],
    ["green", 1],
  ],
  output: [
    ["red", 0],
    ["blue", 2],
    ["green", 1],
  ],
};
