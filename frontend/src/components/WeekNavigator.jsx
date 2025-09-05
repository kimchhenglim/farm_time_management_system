import React, { useState } from "react";
import leftArrow from "../assets/left_arrow.svg";
import Filter from "../assets/filter.svg";
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";
import CalendarModal from "../modals/CalendarModal";
import CardRoster from "./CardRoster";

function WeekNavigator() {
  // dummy Data
  const roster = [
    {
      date: "2025-09-01",
      day: "Monday",
      data: [
        { staffName: "Alice", location: "Shed 1", time: "08:00 - 12:00" },
        { staffName: "Bob", location: "Shed 2", time: "09:00 - 13:00" },
        { staffName: "Charlie", location: "Shed 3", time: "10:00 - 14:00" },
        { staffName: "Diana", location: "Shed 1", time: "12:00 - 16:00" },
        { staffName: "Ethan", location: "Shed 2", time: "14:00 - 18:00" },
        { staffName: "Chingsien", location: "Shed 3", time: "14:00 - 18:00" },
        { staffName: "Nancy", location: "Shed 1", time: "14:00 - 18:00" },
        { staffName: "Mia", location: "Shed 2", time: "14:00 - 18:00" },
        { staffName: "Riley", location: "Shed 3", time: "14:00 - 18:00" },
      ],
    },
    {
      date: "2025-09-02",
      day: "Tuesday",
      data: [
        { staffName: "Fiona", location: "Shed 2", time: "08:00 - 12:00" },
        { staffName: "George", location: "Shed 3", time: "09:00 - 13:00" },
        { staffName: "Hannah", location: "Shed 1", time: "10:00 - 14:00" },
        { staffName: "Ian", location: "Shed 2", time: "12:00 - 16:00" },
        { staffName: "Judy", location: "Shed 3", time: "14:00 - 18:00" },
      ],
    },
    {
      date: "2025-09-03",
      day: "Wednesday",
      data: [
        { staffName: "Kevin", location: "Shed 1", time: "08:00 - 12:00" },
        { staffName: "Laura", location: "Shed 2", time: "09:00 - 13:00" },
        { staffName: "Mike", location: "Shed 3", time: "10:00 - 14:00" },
        { staffName: "Nina", location: "Shed 1", time: "12:00 - 16:00" },
        { staffName: "Oscar", location: "Shed 2", time: "14:00 - 18:00" },
      ],
    },
    {
      date: "2025-09-04",
      day: "Thursday",
      data: [
        { staffName: "Paul", location: "Shed 3", time: "08:00 - 12:00" },
        { staffName: "Quinn", location: "Shed 1", time: "09:00 - 13:00" },
        { staffName: "Rachel", location: "Shed 2", time: "10:00 - 14:00" },
        { staffName: "Sam", location: "Shed 3", time: "12:00 - 16:00" },
        { staffName: "Tina", location: "Shed 1", time: "14:00 - 18:00" },
      ],
    },
    {
      date: "2025-09-05",
      day: "Friday",
      data: [
        { staffName: "Uma", location: "Shed 2", time: "08:00 - 12:00" },
        { staffName: "Victor", location: "Shed 3", time: "09:00 - 13:00" },
        { staffName: "Wendy", location: "Shed 1", time: "10:00 - 14:00" },
        { staffName: "Xavier", location: "Shed 2", time: "12:00 - 16:00" },
        { staffName: "Yvonne", location: "Shed 3", time: "14:00 - 18:00" },
      ],
    },
    {
      date: "2025-09-06",
      day: "Saturday",
      data: [
        { staffName: "Zack", location: "Shed 1", time: "08:00 - 12:00" },
        { staffName: "Amy", location: "Shed 2", time: "09:00 - 13:00" },
        { staffName: "Brian", location: "Shed 3", time: "10:00 - 14:00" },
        { staffName: "Clara", location: "Shed 1", time: "12:00 - 16:00" },
        { staffName: "David", location: "Shed 2", time: "14:00 - 18:00" },
      ],
    },
    {
      date: "2025-09-07",
      day: "Sunday",
      data: [
        { staffName: "Ella", location: "Shed 3", time: "08:00 - 12:00" },
        { staffName: "Frank", location: "Shed 1", time: "09:00 - 13:00" },
        { staffName: "Grace", location: "Shed 2", time: "10:00 - 14:00" },
        { staffName: "Henry", location: "Shed 3", time: "12:00 - 16:00" },
        { staffName: "Isla", location: "Shed 1", time: "14:00 - 18:00" },
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Week range
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, "MMMM d")} - ${format(
    weekEnd,
    "d, yyyy"
  )}`;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // 👇 Extend to full calendar weeks
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  // get the array of the week
  const week = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const handlePrevWeek = () => {
    setCurrentDate((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate((prev) => addWeeks(prev, 1));
  };

  const handleDateClick = (day) => {
    setCurrentDate(day);
    setIsOpen(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between w-full px-[24px] h-[60px] relative">
        {/* Week display */}
        <div className="flex gap-[24px] items-center">
          <span
            className="text-[24px] text-[#566074] font-semibold p-2 hover:bg-[#F2F2F2] hover:rounded-sm cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {weekRange}
          </span>
          <div className="flex gap-2">
            <button
              className="h-[40px] w-[40px] bg-[#F0FDF4] flex items-center justify-center rounded-l-[5px] cursor-pointer"
              onClick={handlePrevWeek}
            >
              <img
                src={leftArrow}
                className="w-[20px] h-[20px] "
                alt="left-arrow"
              />
            </button>
            <button
              className="h-[40px] w-[40px] bg-[#F0FDF4] flex items-center justify-center rounded-r-[5px] cursor-pointer"
              onClick={handleNextWeek}
            >
              <img
                src={leftArrow}
                className="w-[20px] h-[20px] rotate-180"
                alt="left-arrow"
              />
            </button>
          </div>
        </div>
        {/* filter */}
        <div className="bg-[#F7F8FA] border-[1px] border-solid border-[#E0E0E0] flex items-center p-4 rounded-[5px] gap-3">
          <img src={Filter} alt="filter" />
          <span className="text-[#566074] font-semibold cursor-pointer">
            All Location
          </span>
        </div>

        {/* Calendar Modal */}
        <CalendarModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          currentDate={currentDate}
          days={days}
          weekStart={weekStart}
          weekEnd={weekEnd}
          handleDateClick={handleDateClick}
        />
      </div>
      {/* roster */}
      <div className="w-full h-[calc(100%-60px)] px-2">
        <div className="w-full h-[80px] grid grid-cols-7">
          {week?.map((item, index) => {
            return (
              <div
                className="flex items-center justify-center flex-col"
                key={index}
              >
                <div
                  className={`w-[30%] h-full flex items-center justify-center flex-col p-2 ${
                    item.getFullYear() +
                      "-" +
                      item.getDate() +
                      "-" +
                      item.getMonth() ===
                    today.getFullYear() +
                      "-" +
                      today.getDate() +
                      "-" +
                      today.getMonth()
                      ? "bg-green-500 rounded-[5px] text-white"
                      : "text-[#566074] "
                  }`}
                >
                  <span className={`text-[24px] font-semibold `}>
                    {item.getDate()}
                  </span>
                  <span
                    className={`font-medium text-[#8D8D8D] ${
                      item.getFullYear() +
                        "-" +
                        item.getDate() +
                        "-" +
                        item.getMonth() ===
                      today.getFullYear() +
                        "-" +
                        today.getDate() +
                        "-" +
                        today.getMonth()
                        ? " text-white"
                        : " "
                    }`}
                  >
                    {dayOfWeek[index]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full h-[calc(100%-80px)] grid grid-cols-7  overflow-y-auto">
          {week?.map((item, index) => {
            return (
              <div
                className="border-[1px] border-[#EDEDED] flex items-center  flex-col p-2 gap-2.5"
                key={index}
              >
                {roster[index]?.data?.map((shift, index) => {
                  return (
                    <CardRoster
                      staffName={shift.staffName}
                      location={shift.location}
                      time={shift.time}
                      key={index}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeekNavigator;
