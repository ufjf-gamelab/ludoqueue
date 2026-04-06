import { useState } from "react";
import { useGame } from "../Provider";
import { initialState } from "./initialState";
import { splitterSimplesData } from "./splitterSimples";
import { splitterComplexoData } from "./splitterComplexo";
import { mergerSimplesData } from "./mergerSimples";
import { mergerComplexoData } from "./mergerComplexo";
import { exchangerConsumerData } from "./exchangerConsumer";


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
                switch(e.target.value){
                  case("initialState"):{
                    dispatch({ type: "change game data", data: initialState });
                    break;
                  }
                  case("splitter simples"):{
                    dispatch({ type: "change game data", data: splitterSimplesData });
                    break;
                  }
                  case("splitter complexo"):{
                    dispatch({ type: "change game data", data: splitterComplexoData });
                    break;
                  }
                  case("merger simples"):{
                    dispatch({ type: "change game data", data: mergerSimplesData });
                    break;
                  }
                  case("merger complexo"):{
                    dispatch({ type: "change game data", data: mergerComplexoData });
                    break;
                  }
                  case("exchanger Consumer"):{
                    dispatch({ type: "change game data", data: exchangerConsumerData });
                    break;
                  }
                }
              }}
            >
              <option value="initialState">InitialData</option>
              <option value="splitter simples">Splitter Simples</option>
              <option value="splitter complexo">Splitter Complexo</option>
              <option value="merger simples">Merger Simples</option>
              <option value="merger complexo">Merger Complexo</option>
              <option value="exchanger Consumer">Exchanger Consumer</option>
            </select>
          </label>
        </div>
    )
}
