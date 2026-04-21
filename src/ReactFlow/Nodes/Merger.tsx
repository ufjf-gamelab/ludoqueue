import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { EntityMergerNode } from "../Node";
import "./Merger.css";
import { useGame } from "../../Provider";
import type { EntityMergerType } from "../../entities/EntitiesTypes";

export default function MergerGraphNode({ data }: NodeProps<EntityMergerNode>) {
    const { game } = useGame()!;
    const entity = game.entities.get(data.entity.id) as EntityMergerType;
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

      {entity.leavingDirection === "left" && //naovai dar pra usar varios handlers pq a conexao teria q ser manual 
      (
        <> 
            <Handle type="source" position={Position.Left} />
            <Handle type="target" position={Position.Right} />
            <Handle type="target" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />

        </>
      )}
      {entity.leavingDirection === "right" && (
        <>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
            <Handle type="target" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </>
      )}
      {entity.leavingDirection === "up" && (
        <>
            <Handle type="target" position={Position.Bottom} />
            <Handle type="target" position={Position.Right} />
            <Handle type="source" position={Position.Top} />
            <Handle type="target" position={Position.Left} />
        </>
      )}
      {entity.leavingDirection === "down" && (
        <>
            <Handle type="target" position={Position.Top} />
            <Handle type="target" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Bottom} />
        </>
      )}
    </div>
  );
}
