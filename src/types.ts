type NodeIDType = string;

type NodeType = {
  id: NodeIDType;
  name: string;
  val: number;
};

type LinkType = {
  source: NodeIDType;
  target: NodeIDType;
}

export type GraphType = {
  nodes: NodeType[];
  links: LinkType[];
};

