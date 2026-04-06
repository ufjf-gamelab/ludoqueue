import { useState } from "react";
import { useGame } from "../Provider";
import { GameDatas } from "./DatasRecord";

export function DataChanger() {
  const { dispatch } = useGame()!;
  const [selectedData, setSelectedData] = useState("data1");
  return (
    <div
      style={{
        marginTop: "5px",
        fontSize: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Select Data:</span>
        <select
          value={selectedData}
          onChange={(e) => {
            setSelectedData(e.target.value);
            const data = GameDatas[e.target.value];
            if (data) {
              dispatch({ type: "change game data", data: data });
            }
          }}
        >
          <option value="initialState">InitialData</option>
          <option value="splitter simples">Splitter Simples</option>
          <option value="splitter complexo">Splitter Complexo</option>
          <option value="merger simples">Merger Simples</option>
          <option value="merger complexo">Merger Complexo</option>
          <option value="exchanger consumer">Exchanger Consumer</option>
        </select>
      </label>
    </div>
  );
}
