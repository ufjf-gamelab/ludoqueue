type NodeIDType = string;

type NodeType = NodeMineType | NodeStockType | NodeConsumerType;

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

type LinkType = LinkTransportType;

type LinkTransportType = {
  type:"transport";
  source: NodeIDType;
  target: NodeIDType;
  val: number;
  
}


export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};
