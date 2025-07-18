import { useEffect, useState } from "react"

export default function Counter(){
    const [counter,setCounter] = useState(0);
    const [playing,setPlaying] = useState(false);
    useEffect(() => {
        console.log("ping");
        setPlaying(true);
    },[])
    useEffect(() => {
        let timerID: number;
        if (playing){
            timerID = setTimeout(()=>{
                setCounter(counter+1);
            },1000);
        }
        return ()=>{
            clearTimeout(timerID);
        }
    },[counter,playing])
    
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
            }}>Reset</button>
        </div>
    )
}