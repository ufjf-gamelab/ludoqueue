import "./SplitterTile.css";
import {
  type EntitySplitterType,
} from "../EntitiesTypes";
import "../Toolset.css";
import SplitterSprite from "../../assets/splitter/SplitterSprite";

export default function SplitterTile({
  entity,
}: {
  entity: EntitySplitterType;
}) {
  return (
    <div className="splitter-tile">
      <SplitterSprite entity={entity}/>
    </div>
  );
}
