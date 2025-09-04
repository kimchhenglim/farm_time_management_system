import React from "react";

function CardRoster({ staffName, location, time }) {
  //pre-define color for shift
  const locationColors = {
    "Shed 1": "bg-[#D1EEEC] text-[#19A598]",
    "Shed 2": "bg-[#FFD0E0] text-[#C41651]",
    "Shed 3": "bg-[#C8EDFD] text-[#1773E0]",
  };
  console.log(locationColors["Shed 1"].bg);
  console.log(location);
  return (
    <div
      className={` w-full h-[70px] p-2 flex flex-col gap-2 ${locationColors[location]}  rounded-[5px]`}
    >
      <span className=" font-semibold text-[14px]">{staffName}</span>
      <div className="flex gap-2 items-center">
        <span className=" font-medium 2xl:text-[10px] xl:text-[10px]">
          {time}
        </span>
        <div className="w-[3px] h-[3px] rounded-full bg-[#19A598] "></div>
        <span className="italic xl:text-[10px]">{location}</span>
      </div>
    </div>
  );
}

export default CardRoster;
