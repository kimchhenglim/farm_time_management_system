import React, { useState } from "react";
import { Link } from "react-router-dom";

function CardStationManagement({ bg, symbol, text_color, border, text, path }) {
  // set open the selection
  const [isClicked, setIsClicked] = useState(false);
  // handle the break
  const handleBreak = () => {};
  return (
    <div
      className={`cursor-pointer mt-[150px] w-[250px] h-[250px] flex flex-col  ${text_color} font-semibold text-2xl items-center justify-center rounded-[30px] ${border} bg-[${bg}] relative`}
    >
      {text === "Break-in" ? (
        <div
          className="flex items-center justify-center flex-col gap-4"
          onClick={() => setIsClicked((prev) => !prev)}
        >
          {symbol}
          <span>{text}</span>
        </div>
      ) : (
        <Link
          to={path}
          className="flex items-center justify-center flex-col gap-4"
        >
          {symbol}
          <span>{text}</span>
        </Link>
      )}

      {/* if text="Break-in" */}

      {!isClicked ? (
        <></>
      ) : (
        <div
          className={`${
            text === "Break-in" ? "block" : "hidden"
          } absolute top-[85%] left-[75%] border-2 border-[#16A34A] w-[200px] h-fit  rounded-lg bg-[#FBFBFB] flex flex-col text-[#566074] `}
        >
          <Link to={`${path}/meal-break`} className="p-2 cursor-pointer">
            Meal break
          </Link>
          {/* line break*/}
          <div className="bg-black h-[1px] w-full"></div>
          <Link to={`${path}/emergency`} className="p-2 cursor-pointer">
            Emergency
          </Link>
        </div>
      )}
    </div>
  );
}

export default CardStationManagement;
