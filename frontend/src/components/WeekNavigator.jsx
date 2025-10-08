import React, { useState, useEffect } from "react";
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
import useRosterStore from "../stores/useRosterStore";
import StationModal from "./StationModal";

function WeekNavigator() {
  const { roster, fetchRoster } = useRosterStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const StationsList = ["Shed 1", "Shed 2", "Shed 3"];
  const [selectedStations, setSelectedStations] = useState([...StationsList]);
  const today = new Date();
  const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Week range helpers
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, "MMMM d")} - ${format(
    weekEnd,
    "d, yyyy"
  )}`;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const week = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Function to fetch roster with current date and selected Stations
  const handleFetchRoster = (
    date = currentDate,
    Stations = selectedStations
  ) => {
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    fetchRoster(start, Stations);
  };

  // Week navigation
  const handlePrevWeek = () => {
    const newDate = subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    handleFetchRoster(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    handleFetchRoster(newDate);
  };

  // Date click for calendar modal
  const handleDateClick = (day) => {
    setCurrentDate(day);
    setIsOpen(false);
    handleFetchRoster(day);
  };

  // Effect to fetch roster when date or selected Stations change
  useEffect(() => {
    handleFetchRoster();
  }, [currentDate, selectedStations]);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between w-full pb-5 px-[24px] h-[60px] relative">
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
                className="w-[20px] h-[20px]"
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
                alt="right-arrow"
              />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="relative">
          <div
            className="bg-[#F7F8FA] border border-[#E0E0E0] flex items-center p-4 rounded-[5px] gap-3 cursor-pointer"
            onClick={() => setStationDropdownOpen((prev) => !prev)}
          >
            <img src={Filter} alt="filter" />
            <span className="text-[#566074] font-semibold">
              {selectedStations.length === 0 ||
              selectedStations.length === StationsList.length
                ? "All Station"
                : selectedStations.join(", ")}
            </span>
          </div>

          {stationDropdownOpen && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow w-48 max-h-60 overflow-y-auto">
              {/* All checkbox */}
              <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStations.length === StationsList.length}
                  onChange={() => {
                    const allSelected =
                      selectedStations.length === StationsList.length;
                    const newSelected = allSelected ? [] : [...StationsList];
                    setSelectedStations(newSelected);
                  }}
                  className="mr-2 accent-green-600"
                />
                <span className="text-gray-700 font-semibold">All</span>
              </label>

              {/* Individual Stations */}
              {StationsList.map((sta) => {
                const colorMap = {
                  "Shed 1": "#19A598",
                  "Shed 2": "#C41651",
                  "Shed 3": "#1773E0",
                };

                return (
                  <label
                    key={sta}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStations.includes(sta)}
                      onChange={() => {
                        let newSelected;
                        if (selectedStations.includes(sta)) {
                          newSelected = selectedStations.filter(
                            (l) => l !== sta
                          );
                        } else {
                          newSelected = [...selectedStations, sta];
                        }
                        setSelectedStations(newSelected);
                        console.log("Selected stations:", newSelected);
                      }}
                      className="mr-2 accent-green-600"
                    />
                    <span
                      className="font-semibold"
                      style={{ color: colorMap[sta] }}
                    >
                      {sta}
                    </span>
                  </label>
                );
              })}

              {/* ➕ Add new button */}
              <div className="border-t border-gray-200 py-[12px] px-[31px] flex items-center justify-center">
                <button
                  onClick={() => setIsStationModalOpen(true)}
                  className="font-semibold cursor-pointer"
                >
                  Manage...
                </button>
              </div>
            </div>
          )}
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

      {/* Roster */}
      <div className="w-full h-[calc(100%-60px)] px-2">
        {/* Header row with dates */}
        <div className="w-full h-[80px] grid grid-cols-7">
          {week.map((item, index) => {
            const dayStr = format(item, "yyyy-MM-dd");
            const isToday =
              format(item, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
            return (
              <div
                className="flex items-center justify-center flex-col"
                key={dayStr}
              >
                <div
                  className={`w-[30%] h-full flex items-center justify-center flex-col p-2 ${
                    isToday
                      ? "bg-green-500 rounded-[5px] text-white"
                      : "text-[#566074]"
                  }`}
                >
                  <span className="text-[24px] font-semibold">
                    {item.getDate()}
                  </span>
                  <span
                    className={`font-medium ${
                      isToday ? "text-white" : "text-[#8D8D8D]"
                    }`}
                  >
                    {dayOfWeek[index]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Roster cells */}
        <div className="w-full h-[calc(100%-80px)] grid grid-cols-7 overflow-y-auto">
          {week.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const rosterForDay = roster.find((r) => r.date === dayStr);
            const filteredShifts = (rosterForDay?.data ?? []).filter((shift) =>
              selectedStations.includes(shift.station)
            );

            return (
              <div
                className="border border-[#EDEDED] flex flex-col p-2 gap-2.5"
                key={dayStr}
              >
                {filteredShifts.map((shift, i) => (
                  <CardRoster
                    key={shift.id ?? `${dayStr}-${i}`}
                    employeeName={shift.employeeName}
                    station={shift.station}
                    time={shift.time}
                    index={i}
                    columnIndex={dayStr}
                    rosterID={shift.id}
                    date={dayStr}
                    payRate={shift.payRate}
                    type={shift.type}
                    totalHour={shift.totalHour}
                    employeeId={shift.employeeId}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal for station management */}
      <StationModal
        isOpenModal={isStationModalOpen}
        setIsOpenModal={setIsStationModalOpen}
      />
    </div>
  );
}

export default WeekNavigator;
