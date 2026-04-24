import type { EntitySplitterType } from "../../entities/EntitiesTypes";
import "./SplitterSprite.css";
export default function SplitterSprite({ entity }: { entity:EntitySplitterType }) {
    return <div className={`splitter-sprite ${["splitter-direction", entity.entryDirection].join("-")}`}/>;
}
