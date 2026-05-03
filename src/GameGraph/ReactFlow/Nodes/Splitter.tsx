import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { EntitySplitterNode } from "../ReactFlowNodeTypes";
import "./Splitter.css";
import { useGame } from "../../../Provider";
import type { EntitySplitterType } from "../../../entities/EntitiesTypes";

export default function SplitterGraphNode({
  data,
}: NodeProps<EntitySplitterNode>) {
  const { game } = useGame()!;
  const entity = game.entities.get(data.entity.id) as EntitySplitterType;
  return (
    <div className="node">
      {data.entity.id};
      <div className="content">
        <div className="box">
          {entity.goods.map((good, i) => (
            <div key={i}>
              <p>
                {good.goodType}, {good.time}
              </p>
            </div>
          ))}
        </div>
        <div className="circle">
          <p>{data.entity.rate}</p>
        </div>
      </div>
      {entity.entryDirection === "left" && ( //naovai dar pra usar varios handlers pq a conexao teria q ser manual
        <>
          <Handle type="source" position={Position.Right} />
          <Handle type="target" position={Position.Left} />
        </>
      )}
      {entity.entryDirection === "right" && (
        <>
          <Handle type="target" position={Position.Right} />
          <Handle type="source" position={Position.Left} />
        </>
      )}
      {entity.entryDirection === "up" && (
        <>
          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Top} />
        </>
      )}
      {entity.entryDirection === "down" && (
        <>
          <Handle type="source" position={Position.Top} />
          <Handle type="target" position={Position.Bottom} />
        </>
      )}
    </div>
  );
}
