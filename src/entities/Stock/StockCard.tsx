import { useState } from "react";
import type { EntityStockType } from "../EntitiesTypes";
import Stock from "./StockTile";
import "./StockCard.css";
import type { AnchorStyle } from "../Tile";
import { EntityIcons } from "../Icons";

export default function StockCard({ entity }: { entity: EntityStockType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="stockCard"
      onClick={() => setIsHovering(!isHovering)}
      style={
        {
          anchorName: `${"--anchor-" + entity.id}`,
          gridColumn: entity.x + 1,
          gridRow: entity.y + 1,
        } as AnchorStyle
      }
    >
      {isHovering && <Stock entity={entity} />}
      <div className="stockMinimized">
        <div>
          {EntityIcons[entity.type]}
          {entity.goods.length === entity.max ? (
            <p> Stock full! </p>
          ) : (
            <p> {entity.goods.length} items on stock. </p>
          )}
        </div>
        <progress value={entity.goods.length} max={entity.max}></progress>
      </div>
    </div>
  );
}
