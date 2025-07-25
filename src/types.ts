type NodeIDType = string;

type NodeType = NodeMineType | NodeStockType;

type NodeMineType = {
  id: NodeIDType;
  name: string;
  type: "mine";
  val: number;
  max: number;
}

type NodeStockType = {
  id: NodeIDType;
  name: string;
  type: "stock";
  val: number;
  max: number;
  closed: boolean;
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

