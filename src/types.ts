type NodeIDType = string;

export type EntityType =
  | EntitySourceType
  | EntityStockType
  | EntityConsumerType
  | EntityTransportType;

export type EntitySourceType = {
  id: NodeIDType;
  name: string;
  type: "source";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
};

export type EntityStockType = {
  id: NodeIDType;
  name: string;
  type: "stock";
  val: number;
  max: number;
  closed: boolean;
};

export type EntityConsumerType = {
  id: NodeIDType;
  name: string;
  type: "consumer";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
};

export type EntityTransportType = {
  id: NodeIDType;
  name: string;
  type: "transport";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
  source: string;
  target: string;
};

export type LinkType = {
  source: NodeIDType;
  target: NodeIDType;
};

export type GameType = {
  entities: Map<string, EntityType>;
  sources: string[];
  stocks: string[];
  consumers: string[];
  transports: string[];
};

export type NodeType = {
  id: NodeIDType;
  name: string;
  val: number;
};

export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};
