import type { EntityConsumerType } from "../../../entities/EntitiesTypes";
import { useGame } from "../../../Provider";
import type { EntityNode } from "../ReactFlowNodeTypes";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export default function ConsumerGraphNode({ data }: NodeProps<EntityNode>) {
  const { game } = useGame()!;
  const entity = game.entities.get(data.entity.id) as EntityConsumerType;
  return (
    <div style={{ margin: "5px" }}>
      <p>{data.entity.name}</p>
      {entity.entryDirection === "left" && (
        <Handle type="target" position={Position.Left} />
      )}
      {entity.entryDirection === "right" && (
        <Handle type="target" position={Position.Right} />
      )}
      {entity.entryDirection === "up" && (
        <Handle type="target" position={Position.Top} />
      )}
      {entity.entryDirection === "down" && (
        <Handle type="target" position={Position.Bottom} />
      )}
    </div>
  );
}
