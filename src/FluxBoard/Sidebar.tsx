import EditorMenu from "../Editor/EditorMenu";
import { useGame } from "../Provider";
import ToolBar, { type ToolCategory } from "./ToolBar";
import "./Sidebar.css";
import { useState } from "react";

export function Sidebar() {
  const { game } = useGame()!;
  const [category, setCategory] = useState<ToolCategory>("factory");

  return (
    <div className="sidebar">
      <section className="sidebar-tools" aria-label="Ferramentas">
        <div className="category-tabs" role="tablist" aria-label="Categorias">
          <button
            id="factory-tab"
            className={category === "factory" ? "selected" : ""}
            role="tab"
            aria-selected={category === "factory"}
            aria-controls="category-tools"
            onClick={() => setCategory("factory")}
          >
            Fábrica e consumidores
          </button>
          <button
            id="transport-tab"
            className={category === "transport" ? "selected" : ""}
            role="tab"
            aria-selected={category === "transport"}
            aria-controls="category-tools"
            onClick={() => setCategory("transport")}
          >
            Transporte
          </button>
        </div>
        <div
          id="category-tools"
          role="tabpanel"
          aria-labelledby={`${category}-tab`}
        >
          <ToolBar category={category} />
        </div>
      </section>
      <div className="sidebar-properties">
        <EditorMenu editor={game.editor} />
      </div>
    </div>
  );
}
