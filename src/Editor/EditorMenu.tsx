import { DirectionIcons, RotationIcons } from "../entities/Icons";
import type { GameEditor } from "../types";
import "./EditorMenu.css"

export default function EditorMenu({ editor }: { editor: GameEditor }) {
  if (!editor) {
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
            <button onClick={() => editor.max++}> + </button>
            <button onClick={() => editor.max--}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
            <div>
            <button
              onClick={() => {
                if (editor.rate >= 1) {
                  editor.rate = 1;
                  return;
                } else {
                  editor.rate = editor.rate + 0.1;
                }
              }}
            >
              {" "}
              +{" "}
            </button>
            <button
              onClick={() => {
                if (editor.rate <= 0) {
                  editor.rate = 0;
                  return;
                } else {
                  editor.rate = editor.rate - 0.1;
                }
              }}
            >
              {" "}
              -{" "}
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
            <button onClick={() => editor.max++}> + </button>
            <button onClick={() => editor.max--}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Val: {editor.val}
            <div>
            <button onClick={() => editor.val++}> + </button>
            <button onClick={() => editor.val--}> - </button>
            </div>
          </div>
          <div className={"EditorProp"}>
            Direction: {DirectionIcons[editor.direction]}
            <div>
            <button
              onClick={() => {
                if (editor.direction === "right") {
                  editor.direction = "up";
                } else if (editor.direction === "up") {
                  editor.direction = "left";
                } else if (editor.direction === "left") {
                  editor.direction = "down";
                } else if (editor.direction === "down") {
                  editor.direction = "right";
                }
              }}
            >
              {
              RotationIcons["counterclockwise"]}
            </button>
            <button
              onClick={() => {
                if (editor.direction === "right") {
                  editor.direction = "down";
                } else if (editor.direction === "down") {
                  editor.direction = "left";
                } else if (editor.direction === "left") {
                  editor.direction = "up";
                } else if (editor.direction === "up") {
                  editor.direction = "right";
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
