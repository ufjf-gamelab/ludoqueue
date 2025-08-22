import { useState } from "react";
//import { useGame } from "./Provider";

export default function GraphEditor() {
  const [source, setSource] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  //const {dispatch} = useGame()!;
  return (
    <div>
      <label>
        Source:{" "}
        <input
          type="text"
          name="source"
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
          }}
        />
      </label>
      <label>
        Target:{" "}
        <input
          type="text"
          name="target"
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
          }}
        />
      </label>
      <button
        onClick={() => {
          //dispatch({ type: "create link", source, target });
        }}
      >
        Ligar
      </button>
      <button
        onClick={() => {
          //dispatch({ type: "delete link", source, target });
        }}
      >
        Desligar
      </button>
    </div>
  );
}
