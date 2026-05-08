import { useEffect, useState } from "react";
import { useGame } from "./Provider";

export default function Counter() {
  const { dispatch, game } = useGame()!;
  const [counter, setCounter] = useState(game.time);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(true);
  }, []);
  // reset counter quando trocar de data
  useEffect(() => {
    setCounter(game.time);
  }, [game.data, game.time]);

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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "38px",
        }}
      >
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
