import React from "react";
import {
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
  format,
} from "date-fns";
function CalendarModalReport({
  isOpen,
  setIsOpen,
  currentDate,
  days,
  weekStart,
  weekEnd,
  handleDateClick,
  top,
  today,
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-[var(--custom-shadow)] w-[350px] absolute ${
        top ? top : "top-[60px]"
      } z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#566074]">
          {format(currentDate, "MMMM, yyyy")}
        </h2>
        <button
          className="text-gray-500 font-bold"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-sm font-medium text-gray-600 mb-2">
        {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center gap-y-2">
        {days.map((day) => {
          const inWeek = isWithinInterval(day, {
            start: weekStart,
            end: weekEnd,
          });
          const isToday = isSameDay(day, today);
          const isInMonth = isSameMonth(day, currentDate);
          const isFuture = isAfter(day, today);

          return (
            <div
              key={day}
              className={`${inWeek ? "bg-[#F0FDF4]" : ""} ${
                inWeek && format(day, "i") === "1" ? "rounded-l-full" : ""
              } ${inWeek && format(day, "i") === "7" ? "rounded-r-full" : ""}`}
            >
              <div
                onClick={() => !isFuture && handleDateClick(day)}
                className={`p-2 w-[43px] h-[43px] mx-auto rounded-full cursor-pointer transition
                  ${!isInMonth ? "text-gray-400" : "text-black"}
                  ${
                    isFuture
                      ? "cursor-not-allowed text-gray-300 opacity-60"
                      : "hover:bg-green-200"
                  }
                  ${isToday ? "bg-[#16A34A] text-white font-semibold" : ""}`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarModalReport;
