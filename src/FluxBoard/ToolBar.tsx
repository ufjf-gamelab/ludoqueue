import { FaTrashAlt } from "react-icons/fa";
import { EntityIcons } from "../entities/Icons";
import { useGame } from "../Provider";
import "./ToolBar.css";
import { TiCancel } from "react-icons/ti";

export default function ToolBar() {
  const { game, dispatch } = useGame()!;

  return (
    <div className="tool-selector">
      <div>Selected: {game.selected?.id}</div>
      <div>Status: {game.status}</div>

      <div className="tile-list">
        <button
          className={game.status === "transport" ? "selected" : ""}
          onClick={() =>
            dispatch({ type: "set status", newStatus: "transport" })
          }
          title="Create a new Transport"
        >
          {EntityIcons["transport right"]}
        </button>
        <button
          className={game.status === "stock" ? "selected" : ""}
          onClick={() => dispatch({ type: "set status", newStatus: "stock" })}
          title="Create a new Stock"
        >
          {EntityIcons["stock"]}
        </button>
        <button
          className={game.status === "consumer" ? "selected" : ""}
          onClick={() =>
            dispatch({ type: "set status", newStatus: "consumer" })
          }
          title="Create a new Consumer"
        >
          {EntityIcons["consumer"]}
        </button>
        <button
          className={game.status === "source" ? "selected" : ""}
          onClick={() => dispatch({ type: "set status", newStatus: "source" })}
          title="Create a new Source"
        >
          {EntityIcons["source"]}
        </button>
        <button
          className={game.status === "splitter" ? "selected" : ""}
          onClick={() => dispatch({ type: "set status", newStatus: "splitter" })}
          title="Create a new Splitter"
        >
          {EntityIcons["splitter"]}
        </button>
        <button
          onClick={() => dispatch({ type: "set status", newStatus: "delete" })}
          title="Delete mode - click on an entity to delete it"
        >
          <FaTrashAlt />
        </button>
        <button
          onClick={() => dispatch({ type: "set status", newStatus: "waiting" })}
          title="Exit creation mode"
        >
          <TiCancel />
        </button>

      </div>
    </div>
  );
}
