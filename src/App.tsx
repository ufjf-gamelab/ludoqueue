import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [nodes, setNodes] = useState(new Map(
    [["Apple", 4.75], 
    ["Grape", 2.72],
    ["Banana", 1.00]]
  )
    );
    nodes.set("Durian",13);
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <ul>
          {Array.from(nodes.entries()).map(function (item){
            return <li>{item[0]} &rarr; {item[1]}</li>
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
