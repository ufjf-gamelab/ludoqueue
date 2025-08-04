type NodeIDType = string;

export type NodeType = NodeMineType | NodeStockType | NodeConsumerType | NodeTransportType;

type NodeMineType = {
  id: NodeIDType;
  name: string;
  type: "mine";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
}

type NodeStockType = {
  id: NodeIDType;
  name: string;
  type: "stock";
  val: number;
  max: number;
  closed: boolean;
}

type NodeConsumerType = {
  id: NodeIDType;
  name: string;
  type: "consumer";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
}

type NodeTransportType = {
  id: NodeIDType;
  name: string;
  type: "transport";
  val: number;
  max: number;
  rate: number;
  cooldown: number;
}

type LinkType = {
  source: NodeIDType;
  target: NodeIDType;
}


export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};
