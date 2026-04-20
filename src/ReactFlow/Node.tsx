import { useCallback } from "react";
import type { EntityType } from "../entities/EntitiesTypes";

export const nodeTypes = {
    source: TextUpdaterNode,
}

export function TextUpdaterNode({entity}: {entity: EntityType}) {
  const onChange = useCallback((evt) => {
    console.log(entity.name,evt);
  }, []);
 
  return (
    <div className="text-updater-node">
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
    </div>
  );
}
