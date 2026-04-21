import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { EntityExchangerNode } from "../NodeTypes";
import "./Exchanger.css";
import { useGame } from "../../Provider";
import type { EntityExchangerType } from "../../entities/EntitiesTypes";

export default function ExchangerGraphNode({
  data,
}: NodeProps<EntityExchangerNode>) {
  const { game } = useGame()!;
  const entity = game.entities.get(data.entity.id) as EntityExchangerType;
  return (
    <div className="node">
      {data.entity.id};
      <div className="content">
        <div className="box">
          {entity.inputGoods.map((good, i) => (
            <div key={i}>
              <p>
                {good.goodType}, {good.time}
              </p>
            </div>
          ))}
        </div>
        <div className="circle">
          <p>{data.entity.recipe.input[0][1] + data.entity.recipe.input[1][1] + data.entity.recipe.input[2][1]} &rarr; {data.entity.recipe.output[0][1] + data.entity.recipe.output[1][1] + data.entity.recipe.output[2][1]}</p>
        </div>
        <div className="box">
          {entity.outputGoods.map((good, i) => (
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
