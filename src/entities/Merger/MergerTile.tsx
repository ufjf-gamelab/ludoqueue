import "./MergerTile.css";
import {
  type EntityMergerType,
} from "../EntitiesTypes";
import "../Toolset.css";
import MergerSprite from "../../assets/merger/MergerSprite";

export default function MergerTile({ entity }: { entity: EntityMergerType }) {
  return (
    <div className="merger-tile">
      <MergerSprite entity={entity}/>
    </div>
  );
}
