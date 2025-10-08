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
import StationModal from "../modals/StationModal";
import useStationStore from "../stores/useStationStore";

function WeekNavigator() {
  const { roster, fetchRoster } = useRosterStore();
  const { fetchStationList, stationLoading, stationList } = useStationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedStations, setSelectedStations] = useState([]);

  const today = new Date();
  const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Week helpers
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

  // Fetch roster
  const handleFetchRoster = (
    date = currentDate,
    stations = selectedStations
  ) => {
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    fetchRoster(start, stations);
  };

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

  const handleDateClick = (day) => {
    setCurrentDate(day);
    setIsOpen(false);
    handleFetchRoster(day);
  };

  // Fetch stations once
  useEffect(() => {
    fetchStationList();
  }, []);

  // Fetch roster whenever date or station changes
  useEffect(() => {
    handleFetchRoster();
  }, [currentDate, selectedStations]);

  // ✅ Filter only ACTIVE stations and default-select all of them
  const activeStations = stationList?.filter(
    (s) => (s.status || "").toUpperCase() === "ACTIVE"
  );

  useEffect(() => {
    if (activeStations?.length > 0) {
      setSelectedStations(activeStations.map((s) => s.name || s.stationName));
    }
  }, [stationList]);

  // ✅ Helper for filter text
  const getFilterText = () => {
    if (stationLoading) return "Loading...";
    if (!activeStations || activeStations.length === 0)
      return "No Active Stations";
    if (selectedStations.length === 0) return "Select Station";
    if (selectedStations.length === activeStations.length)
      return "All Stations";
    return selectedStations.join(", ");
  };

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

        {/* Filter Dropdown */}
        <div className="relative">
          <div
            className="bg-[#F7F8FA] border border-[#E0E0E0] flex items-center p-4 rounded-[5px] gap-3 cursor-pointer min-w-[180px] max-w-[280px] overflow-hidden"
            onClick={() => setLocationDropdownOpen((prev) => !prev)}
          >
            <img src={Filter} alt="filter" />
            <span
              className={`text-sm font-semibold truncate ${
                stationLoading ? "text-gray-400" : "text-[#566074]"
              }`}
            >
              {getFilterText()}
            </span>
          </div>

          {locationDropdownOpen && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow w-56 max-h-64 overflow-y-auto">
              {stationLoading ? (
                <div className="flex items-center justify-center p-4 text-gray-500">
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Loading...
                </div>
              ) : (
                <>
                  {/* ✅ Select All */}
                  <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedStations.length === activeStations?.length &&
                        activeStations.length > 0
                      }
                      onChange={() => {
                        const allSelected =
                          selectedStations.length === activeStations?.length;
                        setSelectedStations(
                          allSelected
                            ? []
                            : activeStations.map((s) => s.name || s.stationName)
                        );
                      }}
                      className="mr-2 accent-green-600"
                    />
                    <span className="text-gray-700 font-semibold">All</span>
                  </label>

                  {/* ✅ Each ACTIVE station */}
                  {activeStations?.map((station) => {
                    const name = station.name || station.stationName;
                    return (
                      <label
                        key={station.stationId || name}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStations.includes(name)}
                          onChange={() => {
                            if (selectedStations.includes(name)) {
                              setSelectedStations(
                                selectedStations.filter((s) => s !== name)
                              );
                            } else {
                              setSelectedStations([...selectedStations, name]);
                            }
                          }}
                          className="mr-2 accent-green-600"
                        />
                        <span className="font-semibold text-gray-700 truncate">
                          {name}
                        </span>
                      </label>
                    );
                  })}

                  {/* Manage stations */}
                  <div className="border-t border-gray-200 py-2 flex justify-center">
                    <button
                      onClick={() => setIsStationModalOpen(true)}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Manage...
                    </button>
                  </div>
                </>
              )}
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

      {/* Roster Section */}
      <div className="w-full h-[calc(100%-60px)] px-2">
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

      {/* Station Management Modal */}
      <StationModal
        isOpenModal={isStationModalOpen}
        setIsOpenModal={setIsStationModalOpen}
        stationList={stationList}
      />
    </div>
  );
}

export default WeekNavigator;
