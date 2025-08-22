import { useEffect, useState } from "react"
import { useGame } from "./Provider";

export default function Counter(){
    const [counter,setCounter] = useState(0);
    const [playing,setPlaying] = useState(false);
    const {dispatch} = useGame()!;
    useEffect(() => {
        console.log("ping");
        setPlaying(true);
    },[])
    useEffect(() => {
        let timerID: number;
        if (playing){
            timerID = setTimeout(()=>{
                setCounter(counter+1);
                dispatch({type:"game tick"});
            },1000);
        }
        return ()=>{
            clearTimeout(timerID);
        }
    },[counter,playing,dispatch])
    
    return (
        <div>
            <div>
                {playing?'playing':'stopped'}: {counter}
            </div>
            <button onClick={() => {
                setPlaying(true);
            }}>Start</button>
            <button onClick={() => {
                setPlaying(false);
            }}>Pause</button>
            <button onClick={ () => {
                setCounter(0);
                dispatch({type:"set node value",id:"apple",value:0});
            }}>Reset</button>
        </div>
    )
}
