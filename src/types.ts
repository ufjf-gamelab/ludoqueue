import type { DirectionType, EntityType } from "./entities/EntitiesTypes";

export type GameType = {
  entities: Map<string, EntityType>;
  selected: EntityType|null;
  status: GameStatus;
  editor: GameEditor;
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

export type GameEditor = GameStockEditor | GameConsumerEditor | null;

export type GameStockEditor = {
  type: "stock";
  max: number;
  val: number;
  direction: DirectionType;
}

export type GameConsumerEditor = {
  type: "consumer";
  max: number;
  rate: number;
}
