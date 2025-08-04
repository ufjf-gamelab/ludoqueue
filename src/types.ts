type NodeIDType = string;

export type NodeType = NodeMineType | NodeStockType | NodeConsumerType | NodeTransportType;

export type NodeMineType = {
  id: NodeIDType;
  name: string;
  type: "mine";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
}

export type NodeStockType = {
  id: NodeIDType;
  name: string;
  type: "stock";
  val: number;
  max: number;
  closed: boolean;
}

export type NodeConsumerType = {
  id: NodeIDType;
  name: string;
  type: "consumer";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
}

export type NodeTransportType = {
  id: NodeIDType;
  name: string;
  type: "transport";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
  source?: string;
  target?: string; 
}

type LinkType = {
  source: NodeIDType;
  target: NodeIDType;
}


export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};
