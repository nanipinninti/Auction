import  { useState, useEffect } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const Timer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = Math.max(0, endTime - now);
    setTimeLeft(remaining);
  }, [endTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <CountdownCircleTimer
    isPlaying
    duration={timeLeft}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[20, 10, 5, 0]}
    size = {120} 
    strokeWidth = {5}
  >
    {({ remainingTime }) => 
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-xs"> Remaining Time </h1>
      <h1 className="text-2xl">{remainingTime}</h1>
    </div>
      }
  </CountdownCircleTimer>

  );
};

export default Timer;
