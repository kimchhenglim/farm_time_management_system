import React from "react";

function CardStationManagement({ bg, symbol, text_color, border, text }) {
  return (
    <div
      className={`cursor-pointer mt-[150px] w-[250px] h-[250px] flex flex-col gap-4 ${text_color} font-semibold text-2xl items-center justify-center rounded-[30px] ${border} bg-[${bg}]`}
    >
      {symbol}
      <span>{text}</span>
    </div>
  );
}

export default CardStationManagement;
