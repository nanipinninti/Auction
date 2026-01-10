import { useState, useEffect } from "react";

const Timer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000); // current time in seconds
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);
    };

    updateTimer(); // initial update
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex gap-1 items-start">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-timer-icon lucide-timer"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
        </div>

        <h1 className="text-[12px] text-gray-700 uppercase">Timer</h1>
      </div>

      {/* Plain text → no 99 limit */}
      <span className="text-[17px] text-red-500 font-semibold">
        {timeLeft}
      </span>
    </div>
  );
};

export default Timer;





// import { useState, useEffect } from "react";
// import { CountdownCircleTimer } from 'react-countdown-circle-timer';

// const Timer = ({ endTime }) => {
//   const [timeLeft, setTimeLeft] = useState(0);

//   useEffect(() => {
//     const now = Math.floor(Date.now() / 1000);
//     const remaining = Math.max(0, endTime - now);
//     setTimeLeft(remaining);
//   }, [endTime]);

//   return (
//     <CountdownCircleTimer
//       key={endTime}  // Force re-render when endTime changes
//       isPlaying
//       duration={timeLeft}
//       colors={['#004777', '#F7B801', '#A30000', '#A30000']}
//       colorsTime={[20, 10, 5, 0]}
//       size={120}
//       strokeWidth={5}
//     >
//       {({ remainingTime }) => (
//         <div className="flex flex-col justify-center items-center">
//           <h1 className="text-xs">Remaining Time</h1>
//           <h1 className="text-2xl">{remainingTime}</h1>
//         </div>
//       )}
//     </CountdownCircleTimer>
//   );
// };

// export default Timer;

