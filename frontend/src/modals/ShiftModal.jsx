import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModal";
import Avatar from "../assets/avatar.svg";
import Search from "../assets/search.svg";
import Calendar from "../assets/calendar.svg";
import useRosterStore from "../stores/useRosterStore";
import useStaffStore from "../stores/useStaffStore";
import useStationStore from "../stores/useStationStore";
import { axiosInstances } from "../libs/axios";

function ShiftModal({
  isOpenModal,
  setIsOpenModal,
  onClose,
  title,
  data,
  onSubmitFunction,
  submitLabel,
}) {
  const inputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [today, setToday] = useState(
    new Date()
      .toLocaleDateString("en-AU")
      .split("/")
      .map((part) => part.padStart(2, "0"))
      .join("-")
  );

  const [formData, setFormData] = useState({
    date: data?.date || "",
    station: data?.station || "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    staffName: data?.staffName || "",
    id: data?.id || "",
    totalHour: data?.totalHour || "",
  });

  // staff store
  const {
    activeStaffList,
    fetchActiveStaffPaginated,
    searchActiveStaff,
    isFetchingActiveStaff,
  } = useStaffStore();

  // station store
  const { fetchStationList, stationList, stationLoading } = useStationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef(null);

  // Fetch stations when modal opens
  useEffect(() => {
    if (isOpenModal) fetchStationList();
  }, [isOpenModal, fetchStationList]);

  // Filter only ACTIVE stations
  const activeStations =
    stationList?.filter((s) => (s.status || "").toUpperCase() === "ACTIVE") ||
    [];

  const generateTimes = () => {
    return Array.from({ length: 24 * 2 }, (_, i) => {
      const hour = Math.floor(i / 2);
      const minute = (i % 2) * 30;
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    });
  };

  const times = generateTimes();

  // refresh date/time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(
        new Date()
          .toLocaleDateString("en-AU")
          .split("/")
          .map((part) => part.padStart(2, "0"))
          .join("-")
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      searchActiveStaff(value, 50);
    }, 250);
  };

  useEffect(() => {
    if (!isOpenModal) return;

    if (data && activeStaffList.length) {
      const staff = activeStaffList.find(
        (s) => s.employeeId === data.employeeId
      );

      if (staff) {
        setSelectedUser(staff);
        setFormData({
          date: data.date || "",
          station: data.station || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          staffName: staff.firstName + " " + staff.lastName,
          id: staff.employeeId,
          totalHour: data.totalHour || 0,
        });
      }
    }
  }, [isOpenModal]);

  // Load first page of active staff on mount
  useEffect(() => {
    if (activeStaffList.length === 0) {
      fetchActiveStaffPaginated(10, 0);
    }
  }, [activeStaffList.length, fetchActiveStaffPaginated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedUser(null);
      setFormData({
        date: "",
        station: "",
        startTime: "",
        endTime: "",
        staffName: "",
        id: "",
      });
      onClose();
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (!isFetchingActiveStaff) fetchActiveStaffPaginated();
    }
  };

  const toAUFormat = (date, time) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year} ${time}`;
  };

  const timeToFloat = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations...
    if (!selectedUser) return toast.error("Please select staff!");
    if (!formData.date) return toast.error("Please enter date");
    if (toAUFormat(formData.date) < today)
      return toast.error("You cannot assign or edit shift in the past!");
    if (!formData.station) return toast.error("Please select a station!");
    if (!formData.startTime || !formData.endTime)
      return toast.error("Please enter shift time!");
    if (formData.endTime <= formData.startTime)
      return toast.error("Start time must not be bigger than End time!");

    const shiftHours =
      timeToFloat(formData.endTime) - timeToFloat(formData.startTime);

    if (
      (selectedUser.type === "Full-time" || selectedUser.type === "Casual") &&
      shiftHours + selectedUser.totalHour > 38
    )
      return toast.error(
        `Cannot save shift. Weekly limit 38h exceeded. Current: ${selectedUser.totalHour}h`
      );

    if (
      selectedUser.type === "Part-time" &&
      shiftHours + selectedUser.totalHour > 20
    )
      return toast.error(
        `Cannot save shift. Weekly limit 20h exceeded. Current: ${selectedUser.totalHour}h`
      );

    const payload = {
      rosterId: selectedUser.id,
      date: formData.date,
      staffId: selectedUser.employeeId,
      staffName: `${selectedUser.firstName} ${selectedUser.lastName}`,
      station: formData.station,
      startTime: toAUFormat(formData.date, formData.startTime),
      endTime: toAUFormat(formData.date, formData.endTime),
      type: selectedUser.type,
      payRate: selectedUser.payRate,
      totalHour: selectedUser.totalHour,
    };

    onSubmitFunction && onSubmitFunction(payload);

    setIsOpenModal(false);
    setSelectedUser(null);
    setFormData({
      date: "",
      station: "",
      startTime: "",
      endTime: "",
      staffName: "",
      id: "",
      totalHour: "",
    });
  };

  if (!isOpenModal) return null;

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-999"
      onMouseDown={handleCloseModal}
    >
      <div className="bg-white rounded-lg p-6 relative w-[977px] shadow-lg text-[#565656] z-10">
        <h2 className="text-xl font-semibold text-[#566074] mb-4">{title}</h2>

        <div className="grid grid-cols-2 gap-4 border-y-[1px] border-[#ADADAD] p-2">
          {/* Left side */}
          <div className="p-2 flex flex-col gap-8">
            <div className="w-full flex gap-8 items-center">
              <img src={Avatar} className="size-[100px]" alt="avatar" />
              {selectedUser ? (
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[24px] font-semibold text-[#566074]">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </span>
                  <span className="text-[#ADADAD]">
                    {selectedUser.contractType +
                      " Pay rate: $" +
                      selectedUser.payRate +
                      "/hr"}
                  </span>
                </div>
              ) : (
                <button className="p-2 bg-[#F5F5F5] h-[41px] w-[112px] rounded-[5px] font-medium text-[#566074] border-[#DEDEDE] border">
                  Assign staff
                </button>
              )}
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6">
              {/* Date */}
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="date" className="text-[#565656] font-medium">
                  Date
                </label>
                <div className="relative border border-[#ADADAD] rounded-[5px] flex items-center">
                  <input
                    type="text"
                    id="date"
                    placeholder="dd/mm/yyyy"
                    value={
                      formData.date
                        ? formData.date.split("-").reverse().join("-")
                        : ""
                    }
                    readOnly
                    className="input bg-white focus:outline-hidden placeholder:text-[#ADADAD] w-full border-none"
                  />
                  <img
                    src={Calendar}
                    alt="calendar"
                    className="size-[15px] mr-[3px]"
                  />
                  <input
                    ref={inputRef}
                    type="date"
                    name="date"
                    onChange={handleChange}
                    value={formData.date}
                    lang="en-AU"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              {/* Station */}
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="station" className="text-[#565656] font-medium">
                  Station
                </label>
                <select
                  name="station"
                  id="station"
                  value={formData.station}
                  onChange={handleChange}
                  disabled={stationLoading}
                  className="border border-[#ADADAD] px-3 py-2 rounded bg-white focus:outline-green-500"
                >
                  {stationLoading ? (
                    <option>Loading stations...</option>
                  ) : activeStations.length > 0 ? (
                    <>
                      <option value="">Select Station</option>
                      {activeStations.map((st) => (
                        <option
                          key={st.stationId || st.id}
                          value={st.name || st.stationName}
                        >
                          {st.name || st.stationName}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="">No active stations</option>
                  )}
                </select>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-[36px]">
                {/* Start Time */}
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="startTime"
                    className="text-[#565656] font-medium"
                  >
                    Start Time
                  </label>
                  <select
                    name="startTime"
                    id="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="border border-[#ADADAD] px-3 py-2 rounded bg-white"
                  >
                    <option value="">Select Start Time</option>
                    {times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Time */}
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="endTime"
                    className="text-[#565656] font-medium"
                  >
                    End Time
                  </label>
                  <select
                    name="endTime"
                    id="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="border border-[#ADADAD] px-3 py-2 rounded bg-white"
                  >
                    <option value="">Select End Time</option>
                    {times.map((t) => (
                      <option
                        key={t}
                        value={t}
                        disabled={formData.startTime && t <= formData.startTime}
                        className={
                          formData.startTime && t <= formData.startTime
                            ? "text-[#ADADAD]"
                            : ""
                        }
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Active Staff */}
          <div className="p-4 flex flex-col gap-[16px] border-l border-[#ADADAD]">
            <span className="text-[20px] font-semibold text-[#566074]">
              Active Staff
            </span>

            <label className="w-full h-[50px] border border-[#E8E8E8] p-2 rounded-[5px] flex items-center">
              <div className="flex items-center gap-[10px] w-full">
                <img src={Search} alt="search" className="size-[15px]" />
                <input
                  type="text"
                  className="outline-none w-full"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </label>

            <div
              className="w-full h-[300px] overflow-y-auto flex flex-col"
              onScroll={handleScroll}
            >
              {activeStaffList?.map((staff, index) => (
                <div
                  key={index}
                  className={`p-2 flex gap-[14px] items-center cursor-pointer ${
                    selectedUser?.id === staff.id ? "bg-[#F0FDF4]" : ""
                  }`}
                  onClick={() => setSelectedUser(staff)}
                >
                  <img src={Avatar} alt="avatar" className="size-[60px]" />
                  <div className="flex flex-col">
                    <span
                      className={` text-[14px] font-semibold ${
                        selectedUser?.id === staff.id
                          ? "text-[#16A34A]"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {staff.firstName} {staff.lastName}
                    </span>
                    <span
                      className={`text-[12px] ${
                        selectedUser?.employeeId === staff.employeeId
                          ? "text-[#16A34A]"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {staff.contractType +
                        " Pay rate: $" +
                        staff.payRate +
                        "/hr"}
                    </span>
                  </div>
                </div>
              ))}
              {isFetchingActiveStaff && (
                <div className="text-center py-2">Loading...</div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded text-[#565656] cursor-pointer"
            onClick={() => {
              setSearchQuery("");
              fetchActiveStaffPaginated(10, 0);
              onClose();
            }}
          >
            Cancel
          </button>

          <ConfirmModal
            propID={`${
              submitLabel === "Create" ? "createShift" : "editShift"
            }"`}
            confirmLabel={`${submitLabel === "Create" ? "Create" : "Edit"}`}
            cancelLabel="Cancel"
            title={`${
              submitLabel === "Create"
                ? "Create this Shift?"
                : "Edit this Shift?"
            }`}
            message="Are you sure all information are correct?"
            handleSubmit={handleSubmit}
            submitLabel={submitLabel}
          />
        </div>
      </div>
    </div>
  );
}

export default ShiftModal;
