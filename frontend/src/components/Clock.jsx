import React, { useEffect, useState } from "react";

function Clock() {
  //create the state that get the time
  const [time, setTime] = useState(new Date());
  //create useEffect hook to move the second forward when the time value change
  useEffect(() => {
    //create the interval ID
    //setInterval(callback,1000 in ms);
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);
    //clean up function clearInterval(ID);
    return () => clearInterval(intervalID);
  }, []);

  //create the function for timeDateFormat
  const timeFormat = () => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let second = time.getSeconds();
    const meridiem = hours >= 12 ? "PM" : "AM";
    // if hours%12 ===0 then return 12 else return remainding
    // ex: hours%12 === 0 ? 12 : hours%12
    hours = hours % 12 || 12;
    // hours= hours%12 &&12
    // ex: hours%12 !==0?12:0
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(
      second
    )} ${meridiem}`;
  };

  //create padZero function to add zero at the end of the single number
  const padZero = (number) => {
    return number < 10 ? "0" + number : number;
  };
  return (
    <div className="text-4xl p-2 h-full flex items-center justify-center border border-[#16A34A] text-[#16A34A] rounded-md ">
      <span>{timeFormat()}</span>
    </div>
  );
}

export default Clock;
