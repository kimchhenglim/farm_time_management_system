import React, { useState, useEffect } from "react";
import {
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

function CalendarModalReport({
  isOpen,
  setIsOpen,
  currentDate, // The *selected* date (from parent)
  // setCurrentDate, // Function to update when user clicks a day
  handleDateClick,
  top,
  today,
}) {
  // 🆕 Local state for what month the calendar is showing
  const [displayedMonth, setDisplayedMonth] = useState(currentDate);
  const [days, setDays] = useState([]);

  // When displayedMonth changes → regenerate days grid
  useEffect(() => {
    const monthStart = startOfMonth(displayedMonth);
    const monthEnd = endOfMonth(displayedMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    setDays(eachDayOfInterval({ start: calendarStart, end: calendarEnd }));
  }, [displayedMonth]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setDisplayedMonth(subMonths(displayedMonth, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(displayedMonth, 1);
    if (isAfter(startOfMonth(nextMonth), today)) return; // block future
    setDisplayedMonth(nextMonth);
  };

  if (!isOpen) return null;

  // Calculate week range of currently selected date (for highlight)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-[var(--custom-shadow)] w-[350px] absolute ${
        top ? top : "top-[60px]"
      } z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-2 py-1 text-gray-600 hover:text-black text-lg cursor-pointer"
        >
          ←
        </button>

        <h2 className="text-lg font-semibold text-[#566074]">
          {format(displayedMonth, "MMMM, yyyy")}
        </h2>

        <button
          onClick={handleNextMonth}
          className={`px-2 py-1 text-lg  ${
            isAfter(startOfMonth(addMonths(displayedMonth, 1)), today)
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-black cursor-pointer"
          }`}
        >
          →
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
          const isInMonth = isSameMonth(day, displayedMonth);
          const isFuture = isAfter(day, today);

          return (
            <div
              key={day}
              className={`${inWeek ? "bg-[#F0FDF4]" : ""} ${
                inWeek && format(day, "i") === "1" ? "rounded-l-full" : ""
              } ${inWeek && format(day, "i") === "7" ? "rounded-r-full" : ""}`}
            >
              <div
                onClick={() => !isFuture && handleDateClick(day)} // 👈 updates parent date
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
