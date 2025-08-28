import type { NodeType } from "../types";

export default function NodeElement({ node }: { node: NodeType }) {
  return (
    <li key={node.id}>
      {node.id}:{JSON.stringify(node)}
    </li>
  );
}
