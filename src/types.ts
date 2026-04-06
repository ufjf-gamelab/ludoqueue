import type { GameEditor } from "./Editor/EditorTypes";
import type { EntityType } from "./entities/EntitiesTypes";

export type GameType = {
  entities: Map<string, EntityType>;
  selected: EntityType|null;
  status: GameStatus;
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

export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};

export type GameStatus = "waiting" | "stock" | "source" | "consumer" | "transport" | "splitter" | "merger" | "exchanger" |"select entity" | "delete";
