import type { EntityMergerType } from "../../entities/EntitiesTypes";
import "./MergerSprite.css";
export default function MergerSprite({ entity }: { entity:EntityMergerType }) {
    return <div className={`merger-sprite ${["direction", entity.leavingDirection].join("-")}`}/>;
}
