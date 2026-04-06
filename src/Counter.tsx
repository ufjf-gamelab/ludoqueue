import { useEffect, useState } from "react";
import { useGame } from "./Provider";

export default function Counter() {
  const [counter, setCounter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { dispatch } = useGame()!;
  useEffect(() => {
    setPlaying(true);
  }, []);
  useEffect(() => {
    let timerID: number;
    if (playing) {
      timerID = setTimeout(() => {
        setCounter(counter + 1);
        dispatch({ type: "game tick" });
      }, 1000);
    }
    return () => {
      clearTimeout(timerID);
    };
  }, [counter, playing, dispatch]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "15px" , alignItems: "center", justifyContent: "center"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "38px"}}>
        {playing ? "playing" : "stopped"}: {counter}
      </div>
      <button
        onClick={() => {
          setPlaying(true);
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          setPlaying(false);
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          setCounter(0);
          dispatch({ type: "reset game" });
        }}
      >
        Reset
      </button>
    </div>
  );
}
