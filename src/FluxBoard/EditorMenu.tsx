import type { GameEditor } from "../types";
import "./EditorMenu.css"

export default function EditorMenu({ editor }: { editor: GameEditor }) {
  if (!editor) {
    return <></>;
  }
  return (
    <div className={"EditorMenu"}>
      {editor.type === "consumer" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <button onClick={() => editor.max++}> + </button>
            <button onClick={() => editor.max--}> - </button>
          </div>
          <div className={"EditorProp"}>
            Rate: {editor.rate}
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
      )}
      {editor.type === "stock" && (
        <div>
          <div className={"EditorProp"}>
            Max: {editor.max}
            <button onClick={() => editor.max++}> + </button>
            <button onClick={() => editor.max--}> - </button>
          </div>
          <div className={"EditorProp"}>
            Val: {editor.val}
            <button onClick={() => editor.val++}> + </button>
            <button onClick={() => editor.val--}> - </button>
          </div>
        </div>
      )}
    </div>
  );
}
