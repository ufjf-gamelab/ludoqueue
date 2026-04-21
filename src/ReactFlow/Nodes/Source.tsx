import type { EntitySourceType } from "../../entities/EntitiesTypes";
import { useGame } from "../../Provider";
import type { EntityNode } from "../NodeTypes";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export default function SourceGraphNode({ data }: NodeProps<EntityNode>) {
  const { game } = useGame()!;
  const entity = game.entities.get(data.entity.id) as EntitySourceType;
  return (
    <div style={{ margin: "5px" }}>
      <p>{data.entity.name}</p>
      {entity.leavingDirection === "left" && (
        <Handle type="source" position={Position.Left} />
      )}
      {entity.leavingDirection === "right" && (
        <Handle type="source" position={Position.Right} />
      )}
      {entity.leavingDirection === "up" && (
        <Handle type="source" position={Position.Top} />
      )}
      {entity.leavingDirection === "down" && (
        <Handle type="source" position={Position.Bottom} />
      )}
    </div>
  );
}
