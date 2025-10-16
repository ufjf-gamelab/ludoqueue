import type { EntityType } from "./entities/EntitiesTypes";

export type GameType = {
  entities: Map<string, EntityType>;
  selected: EntityType|null;
  status: GameStatus;
  sources: string[];
  stocks: string[];
  consumers: string[];
  transports: string[];
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

export type GameStatus = "waiting" | "stock" | "source" | "consumer" | "transport right"| "transport down"| "transport left"| "transport up" | "select entity" | "delete";