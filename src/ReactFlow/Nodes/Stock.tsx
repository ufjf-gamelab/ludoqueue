import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { EntityStockNode } from "../NodeTypes";
import "./Stock.css";
import { useGame } from "../../Provider";
import type { EntityStockType } from "../../entities/EntitiesTypes";

export default function StockGraphNode({ data }: NodeProps<EntityStockNode>) {
  const { game } = useGame()!;
  const entity = game.entities.get(data.entity.id) as EntityStockType;
  return (
    <div className="node">
      {data.entity.id};
      <div className="content">
        <div className="stock-box">
          {entity.goods.map((good, i) => (
            <div key={i}>
              <p>
                {good.goodType}, {good.time}
              </p>
            </div>
          ))}
        </div>
      </div>
      {entity.direction === "left" && (
        <>
          <Handle type="target" position={Position.Right} />
          <Handle type="source" position={Position.Left} />
        </>
      )}
      {entity.direction === "right" && (
        <>
          <Handle type="source" position={Position.Right} />
          <Handle type="target" position={Position.Left} />
        </>
      )}
      {entity.direction === "up" && (
        <>
          <Handle type="target" position={Position.Bottom} />
          <Handle type="source" position={Position.Top} />
        </>
      )}
      {entity.direction === "down" && (
        <>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
        </>
      )}
    </div>
  );
}
