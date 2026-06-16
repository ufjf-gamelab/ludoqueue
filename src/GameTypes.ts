import type Graph from "graphology";
import type { GameEditor } from "./Editor/EditorTypes";
import type { EntityType, RecipeType } from "./entities/EntitiesTypes";

export type GameType = {
  entities: Map<string, EntityType>;
  selected: EntityType|null;
  status: GameStatus;
  offset: { x: number; y: number };
  editor: GameEditor;
  sources: string[];
  stocks: string[];
  consumers: string[];
  transports: string[];
  splitters: string[];
  mergers: string[];
  exchangers: string[];
  time: number;
  data: string;
  recipe: RecipeType;
};

export type LinkType = {
  source: string;
  target: string;
};


export type NodeType = {
  id: string;
  name: string;
  val: number;
};

export type GraphType = Graph;

export type GameStatus = "waiting" | "stock" | "source" | "consumer" | "transport" | "splitter" | "merger" | "exchanger" |"select entity" | "delete" | "recipe";
