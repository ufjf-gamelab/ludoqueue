import type { EntityMergerType } from "../../entities/EntitiesTypes";
import "./MergerSprite.css";
export default function MergerSprite({ entity }: { entity:EntityMergerType }) {
    return <div className={`merger-sprite ${["merger-direction", entity.leavingDirection].join("-")}`}/>;
}
