import type { NodeType } from "../types";

export default function NodeElement({ node }: { node: NodeType }) {
  return (
    <li key={node.id}>
      ID: {node.id}, com peso: {node.val}
    </li>
  );
}
