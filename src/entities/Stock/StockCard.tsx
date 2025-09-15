import { useState } from "react";
import type { EntityStockType } from "../EntitiesTypes";
import Stock from "./Stock";
import { BsSafe2 } from "react-icons/bs";
import "./StockCard.css";

export default function StockCard({ entity }: { entity: EntityStockType }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className="stockCard"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? (
        <Stock entity={entity} />
      ) : (
        <div className="stockMinimized">
          <div>
            <BsSafe2 />
            {entity.val === entity.max ? (
              <p> Stock full! </p>
            ) : (
              <p> {entity.val} items on stock. </p>
            )}
          </div>
          <progress value={entity.val} max={entity.max}></progress>
        </div>
      )}{" "}
    </button>
  );
}
