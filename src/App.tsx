import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [nodes, setNodes] = useState(["Apple", "Grape", "Banana"]);
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <ul>
          {nodes.map(function (item){
            return <li>{item}</li>
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
