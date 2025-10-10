import React, { useState } from "react";
import Filter from "../assets/filter.svg";
import StaffTable from "../components/StaffTable";

import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isAfter,
} from "date-fns";
import CalendarModalReport from "../modals/CalendarModalReport";
import useAttendanceStore from "../stores/useAttendanceStore";

function Report() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  // Week range (prevent going to future)
  const rawWeekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const rawWeekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Clamp weekEnd if it's in the future
  const weekEnd = isAfter(rawWeekEnd, today) ? today : rawWeekEnd;
  const weekStart =
    isAfter(rawWeekEnd, today) && isAfter(rawWeekStart, today)
      ? startOfWeek(today, { weekStartsOn: 1 })
      : rawWeekStart;

  const weekRange = `${format(weekStart, "d")} - ${format(
    weekEnd,
    "d MMMM, yyyy"
  )}`;

  // Calendar setup
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateClick = (day) => {
    // Prevent selecting future days
    if (isAfter(day, today)) return;
    setCurrentDate(day);
    setIsOpen(false);
  };

  // taking staffTable from useAttendanceStore
  // const { staffTable } = useAttendanceStore();
  // const totalAmount = staffTable.reduce((sum, staff) => {
  //   return sum + staff.total;
  // }, 0);
  // console.log(totalAmount);
  return (
    <div className="flex flex-col px-9 py-5 gap-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <span className="font-semibold text-[32px] text-[#566074]">
          Attendance
        </span>
        <div
          className="p-2 bg-[#F5F5F5] flex items-center gap-3 rounded-sm relative cursor-pointer font-semibold text-[#566074]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <img src={Filter} alt="filter" />
          {weekRange}

          {/* Calendar Modal */}
          <CalendarModalReport
            top="top-[40px] left-0"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            currentDate={currentDate}
            days={days}
            weekStart={weekStart}
            weekEnd={weekEnd}
            handleDateClick={handleDateClick}
            today={today} // 👈 pass to modal
          />
        </div>
      </div>

      {/* Table */}
      <StaffTable
        totalElements={0}
        totalPages={1}
        weekStart={weekStart}
        weekEnd={weekEnd}
      />
    </div>
  );
}

export default Report;
