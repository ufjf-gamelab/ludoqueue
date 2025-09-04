import type { EntityType } from "./entities/EntitiesTypes";

export type GameType = {
  entities: Map<string, EntityType>;
  sources: string[];
  stocks: string[];
  consumers: string[];
  transports: string[];
  board: Array<(string | null)>;
  rows: number;
  cols: number;
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
