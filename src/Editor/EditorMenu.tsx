import { DirectionIcons, RotationIcons } from "../entities/Icons";
import "./EditorMenu.css"
import type { GameEditor } from "./EditorTypes";
import { useGame } from "../Provider";

export default function EditorMenu({ editor }: { editor: GameEditor }) {
  const { dispatch } = useGame() || { dispatch: undefined };
  
  if (!editor || !dispatch) {
    return <></>;
  }
  return (
    
    <div className={"EditorMenu"}>
      <p>Properties</p>
      {editor.type === "consumer" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max + 1 })}> + </button>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max - 1 })}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
            <button
              onClick={() => {
                if (editor.rate >= 1) {
                  dispatch({ type: "editor change rate", value: 1 });
                  return;
                } else {
                  dispatch({ type: "editor change rate", value: editor.rate + 0.1 });
                }
              }}
            >
              {" "}
              +{" "}
            </button>
            <button
              onClick={() => {
                if (editor.rate <= 0) {
                  dispatch({ type: "editor change rate", value: 0 });
                  return;
                } else {
                  dispatch({ type: "editor change rate", value: editor.rate - 0.1 });
                }
              }}
            >
              {" "}
              -{" "}
            </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Entry Direction: {editor.entryDirection}
            <div>
            <button
              onClick={() => {
                if (editor.entryDirection === "right") {
                  dispatch({ type: "editor change entry direction", value: "up" });
                } else if (editor.entryDirection === "up") {
                  dispatch({ type: "editor change entry direction", value: "left" });
                } else if (editor.entryDirection === "left") {
                  dispatch({ type: "editor change entry direction", value: "down" });
                } else if (editor.entryDirection === "down") {
                  dispatch({ type: "editor change entry direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["counterclockwise"]}
            </button>
            <button
              onClick={() => {
                if (editor.entryDirection === "right") {
                  dispatch({ type: "editor change entry direction", value: "down" });
                } else if (editor.entryDirection === "down") {
                  dispatch({ type: "editor change entry direction", value: "left" });
                } else if (editor.entryDirection === "left") {
                  dispatch({ type: "editor change entry direction", value: "up" });
                } else if (editor.entryDirection === "up") {
                  dispatch({ type: "editor change entry direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["clockwise"]}
            </button>
            </div>
            
        </div>
        </div>
      )}
      {editor.type === "stock" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max + 1 })}> + </button>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max - 1 })}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Val: {editor.val}
            <div>
            <button onClick={() => dispatch({ type: "editor change val", value: editor.val + 1 })}> + </button>
            <button onClick={() => dispatch({ type: "editor change val", value: editor.val - 1 })}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Direction: {DirectionIcons[editor.direction]}
            <div>
            <button
              onClick={() => {
                if (editor.direction === "right") {
                  dispatch({ type: "editor change direction", value: "up" });
                } else if (editor.direction === "up") {
                  dispatch({ type: "editor change direction", value: "left" });
                } else if (editor.direction === "left") {
                  dispatch({ type: "editor change direction", value: "down" });
                } else if (editor.direction === "down") {
                  dispatch({ type: "editor change direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["counterclockwise"]}
            </button>
            <button
              onClick={() => {
                if (editor.direction === "right") {
                  dispatch({ type: "editor change direction", value: "down" });
                } else if (editor.direction === "down") {
                  dispatch({ type: "editor change direction", value: "left" });
                } else if (editor.direction === "left") {
                  dispatch({ type: "editor change direction", value: "up" });
                } else if (editor.direction === "up") {
                  dispatch({ type: "editor change direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["clockwise"]}
            </button>
            </div>
            </div>
        </div>
      )}
      {editor.type === "source" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max + 1 })}> + </button>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max - 1 })}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
            <button
              onClick={() => {
                if (editor.rate >= 1) {
                  dispatch({ type: "editor change rate", value: 1 });
                  return;
                } else {
                  dispatch({ type: "editor change rate", value: editor.rate + 0.1 });
                }
              }}
            >
              {" "}
              +{" "}
            </button>
            <button
              onClick={() => {
                if (editor.rate <= 0) {
                  dispatch({ type: "editor change rate", value: 0 });
                  return;
                } else {
                  dispatch({ type: "editor change rate", value: editor.rate - 0.1 });
                }
              }}
            >
              {" "}
              -{" "}
            </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Direction: {DirectionIcons[editor.leavingDirection]}
            <div>
            <button
              onClick={() => {
                if (editor.leavingDirection === "right") {
                  dispatch({ type: "editor change leaving direction", value: "up" });
                } else if (editor.leavingDirection === "up") {
                  dispatch({ type: "editor change leaving direction", value: "left" });
                } else if (editor.leavingDirection === "left") {
                  dispatch({ type: "editor change leaving direction", value: "down" });
                } else if (editor.leavingDirection === "down") {
                  dispatch({ type: "editor change leaving direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["counterclockwise"]}
            </button>
            <button
              onClick={() => {
                if (editor.leavingDirection === "right") {
                  dispatch({ type: "editor change leaving direction", value: "down" });
                } else if (editor.leavingDirection === "down") {
                  dispatch({ type: "editor change leaving direction", value: "left" });
                } else if (editor.leavingDirection === "left") {
                  dispatch({ type: "editor change leaving direction", value: "up" });
                } else if (editor.leavingDirection === "up") {
                  dispatch({ type: "editor change leaving direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["clockwise"]}
            </button>
            </div>
            </div>
        </div>
      )}
      {editor.type === "transporter" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <div>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max + 1 })}> + </button>
            <button onClick={() => dispatch({ type: "editor change max", value: editor.max - 1 })}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
            <button
              onClick={() => {
                if (editor.rate >= 1) {
                  dispatch({ type: "editor change rate", value: 1 });
                  return;
                } else {
                  dispatch({ type: "editor change rate", value: editor.rate + 0.1 });
                }
              }}
            >
              {" "}
              +{" "}
            </button>
            <button
              onClick={() => {
                if (editor.rate <= 0) {
                  dispatch({ type: "editor change rate", value: 0 });
                  return;
                } else {
                  dispatch({ type: "editor change rate", value: editor.rate - 0.1 });
                }
              }}
            >
              {" "}
              -{" "}
            </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Entry Direction: {editor.entryDirection}
            <div>
            <button
              onClick={() => {
                if (editor.entryDirection === "right" && editor.leavingDirection !== "down") {
                  dispatch({ type: "editor change entry direction", value: "up" });
                } else if (editor.entryDirection === "up" && editor.leavingDirection !== "left") {
                  dispatch({ type: "editor change entry direction", value: "left" });
                } else if (editor.entryDirection === "left" && editor.leavingDirection !== "up") {
                  dispatch({ type: "editor change entry direction", value: "down" });
                } else if (editor.entryDirection === "down" && editor.leavingDirection !== "right") {
                  dispatch({ type: "editor change entry direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["counterclockwise"]}
            </button>
            <button
              onClick={() => {
                if (editor.entryDirection === "right" && editor.leavingDirection !== "down") {
                  dispatch({ type: "editor change entry direction", value: "down" });
                } else if (editor.entryDirection === "down" && editor.leavingDirection !== "left") {
                  dispatch({ type: "editor change entry direction", value: "left" });
                } else if (editor.entryDirection === "left" && editor.leavingDirection !== "up") {
                  dispatch({ type: "editor change entry direction", value: "up" });
                } else if (editor.entryDirection === "up" && editor.leavingDirection !== "right") {
                  dispatch({ type: "editor change entry direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["clockwise"]}
            </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Direction: {editor.leavingDirection}
            <div>
            <button
              onClick={() => {
                if (editor.leavingDirection === "right" && editor.entryDirection !== "up") {
                  dispatch({ type: "editor change leaving direction", value: "up" });
                } else if (editor.leavingDirection === "up" && editor.entryDirection !== "left") {
                  dispatch({ type: "editor change leaving direction", value: "left" });
                } else if (editor.leavingDirection === "left" && editor.entryDirection !== "down") {
                  dispatch({ type: "editor change leaving direction", value: "down" });
                } else if (editor.leavingDirection === "down" && editor.entryDirection !== "right") {
                  dispatch({ type: "editor change leaving direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["counterclockwise"]}
            </button>
            <button
              onClick={() => {
                if (editor.leavingDirection === "right" && editor.entryDirection !== "down") {
                  dispatch({ type: "editor change leaving direction", value: "down" });
                } else if (editor.leavingDirection === "down" && editor.entryDirection !== "left") {
                  dispatch({ type: "editor change leaving direction", value: "left" });
                } else if (editor.leavingDirection === "left" && editor.entryDirection !== "up") {
                  dispatch({ type: "editor change leaving direction", value: "up" });
                } else if (editor.leavingDirection === "up" && editor.entryDirection !== "right") {
                  dispatch({ type: "editor change leaving direction", value: "right" });
                }
              }}
            >
              {
              RotationIcons["clockwise"]}
            </button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
}
