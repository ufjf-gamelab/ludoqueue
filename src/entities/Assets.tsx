import type { EntityType } from "./EntitiesTypes";
import "./Assets.css";

//Transport assets
export function EntitySprites(entity: EntityType) {
    let isPlaying: boolean = false;
    if (entity.type === "source" && entity.val < entity.max) {
        isPlaying = true;
    }
    if (entity.type === "transport" && entity.val > 0) {
        isPlaying = true;
    }
    return <div className={`${entity.type}-sprite ${entity.type=="transport" ? entity.direction : ""} ${isPlaying ? "running" : "cooldown"}`}></div>;
}
