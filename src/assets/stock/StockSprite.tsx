import { useEffect, useRef, useState } from "react";
import type { EntityStockType } from "../../entities/EntitiesTypes";
import "./StockSprite.css";

export default function StockSprite({ entity }: { entity: EntityStockType }) {
    const [animating, setAnimating] = useState(false);
    const lastSeenTime = useRef(0);
      
    useEffect(() => {
        const newestGood = entity.goods[entity.goods.length - 1];
        if (!newestGood || newestGood.time <= lastSeenTime.current) return;
        lastSeenTime.current = newestGood.time;
        setAnimating(false);
        const timeout = setTimeout(() => setAnimating(true), 10);
        return () => clearTimeout(timeout);
      }, [entity.goods]);
    

    function calculateUsage() {
        if (entity.goods.length === 0) return "empty";
        const usage = entity.goods.length / entity.max;
        if (usage < 1/3) return "empty";
        if (usage < 2/3) return "one";
        if (usage < 1) return "two";
        return "full";
    }
    return <div className={`stock-sprite ${["quantity", calculateUsage()].join("-")}  ${animating ? "animate-stock" : ""}`}/>;
}
