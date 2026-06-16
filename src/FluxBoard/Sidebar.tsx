import EditorMenu from "../Editor/EditorMenu";
import { useGame } from "../Provider";
import ToolBar from "./ToolBar";
import "./Sidebar.css";

export function Sidebar() {
  const { game } = useGame()!;
  return (
    <div className="sidebar">
      <ToolBar />
      <EditorMenu editor={game.editor}></EditorMenu>
    </div>
  );
}
