import React from "react";
import { isSameMonth, isSameDay, isWithinInterval, format } from "date-fns";
function CalendarModal({
  isOpen,
  setIsOpen,
  currentDate,
  days,
  weekStart,
  weekEnd,
  handleDateClick,
}) {
  return (
    <>
      {isOpen && (
        <div className="bg-white p-6 rounded-lg shadow-[var(--custom-shadow)] w-[350px] absolute top-[60px] z-50">
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
              <div key={d} className="text-center ">
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
              const isToday = isSameDay(day, new Date());
              const isInMonth = isSameMonth(day, currentDate);

              return (
                <div
                  className={` 
                      ${inWeek ? "bg-[#F0FDF4]" : ""}
                    ${
                      inWeek && format(day, "i") === "1" ? "rounded-l-full" : ""
                    }
                    ${
                      inWeek && format(day, "i") === "7" ? "rounded-r-full" : ""
                    }
                    `}
                >
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 cursor-pointer transition w-[43px] h-[43px] 
                      ${!isInMonth ? "text-gray-400" : "text-black"}
                      
                      ${
                        isToday
                          ? "bg-[#16A34A] text-white font-semibold rounded-full"
                          : ""
                      }
                      hover:bg-green-200
                    ${
                      inWeek && format(day, "i") === "1" ? "rounded-l-full" : ""
                    }
                    ${
                      inWeek && format(day, "i") === "7" ? "rounded-r-full" : ""
                    }
                    `}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default CalendarModal;
