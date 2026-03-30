import { useState } from "react";
import type { EntityExchangerType } from "../EntitiesTypes";
import "./ExchangerCard.css";
import type { AnchorStyle } from "../Tile";
import { EntityIcons } from "../Icons";
import Exchanger from "./ExchangerTile";

export default function ExchangerCard({ entity }: { entity: EntityExchangerType }) {
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
      {isHovering && <Exchanger entity={entity} />}
      <div className="stockMinimized">
        <div>
          {EntityIcons[entity.type]}
        </div>
      </div>
    </div>
  );
}
