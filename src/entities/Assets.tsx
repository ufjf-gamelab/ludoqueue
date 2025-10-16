import type { EntityType } from "./EntitiesTypes";
import "./Assets.css";

//Transport assets
export function EntitySprites(entity: EntityType) {
    return <div className={`${entity.type}-sprite ${entity.type=="transport" ? entity.direction : ""}`}></div>;
}
