import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "../assets/filter.svg";
import StaffTable from "../components/StaffTable";
import CalendarModal from "../modals/CalendarModal";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";
import AttendanceModal from "../modals/AttendanceModal";
function Report() {
  // for the modal to toggle close and open
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Week range
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, "d")} - ${format(
    weekEnd,
    "d MMMM, yyyy"
  )}`;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  // 👇 Extend to full calendar weeks
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateClick = (day) => {
    setCurrentDate(day);
    setIsOpen(false);
  };
  return (
    <div className="flex flex-col px-9 py-5 gap-6">
      {/* first top part of the report page */}
      <div className="flex items-center gap-6">
        <span className="font-semibold text-[32px] text-[#566074] ">
          Attendance
        </span>
        <div
          className="p-2 bg-[#F5F5F5] flex items-center gap-3 rounded-sm relative cursor-pointer font-semibold text-[#566074]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <img src={Filter} alt="filter" />
          {weekRange}
          {/* Calendar Modal */}
          <CalendarModal
            top="top-[40px] left-0"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            currentDate={currentDate}
            days={days}
            weekStart={weekStart}
            weekEnd={weekEnd}
            handleDateClick={handleDateClick}
          />
        </div>
      </div>
      <div className="w-full flex justify-between items-center cursor-pointer">
        <div className="font-thin text-[#8D8D8D] flex gap-[44px]">
          <span>40 timesheet</span>
          <span>$8,152.00</span>
        </div>
        <div
          className="flex justify-center items-center gap-[12px] px-[40px] py-[16px] border-[#16A34A] border-2 rounded-md text-[#16A34A] font-semibold text-[16px]"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1.5C8 0.946875 7.55312 0.5 7 0.5C6.44688 0.5 6 0.946875 6 1.5V6.5H1C0.446875 6.5 0 6.94688 0 7.5C0 8.05312 0.446875 8.5 1 8.5H6V13.5C6 14.0531 6.44688 14.5 7 14.5C7.55312 14.5 8 14.0531 8 13.5V8.5H13C13.5531 8.5 14 8.05312 14 7.5C14 6.94688 13.5531 6.5 13 6.5H8V1.5Z"
              fill="#16A34A"
            />
          </svg>
          New record
        </div>
      </div>
      <StaffTable totalElements={0} totalPages={1} />
      {/* modal for create attendance */}
      <AttendanceModal
        isOpenModal={isModalOpen}
        setIsOpenModal={setIsModalOpen}
        title="Create new Timesheet"
        onClose={() => setIsModalOpen(false)}
        onSubmitFunction=""
        submitLabel="Save"
      />
    </div>
  );
}

export default Report;
