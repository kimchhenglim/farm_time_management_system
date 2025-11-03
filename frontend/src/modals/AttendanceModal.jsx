import React, { useEffect, useRef, useState } from "react";
import useRosterStore from "../stores/useRosterStore";
import Avatar from "../assets/avatar.svg";
import Calendar from "../assets/calendar.svg";
import Search from "../assets/search.svg";
import ConfirmModal from "./ConfirmationModal";
import useStaffStore from "../stores/useStaffStore";
import useAttendanceStore from "../stores/useAttendanceStore";
import useStationStore from "../stores/useStationStore";
import toast from "react-hot-toast";

function AttendanceModal({
  isOpenModal,
  setIsOpenModal,
  onClose,
  title,
  data,
  onSubmitFunction,
  submitLabel,
}) {
  const inputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(data || null);
  const { createAttendance } = useAttendanceStore();
  const { stationList, fetchStationList, stationLoading } = useStationStore();
  const [errors, setErrors] = useState({});

  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
  const {
    activeStaffList,
    fetchActiveStaffPaginated,
    searchActiveStaff,
    isFetchingActiveStaff,
  } = useStaffStore();

  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (value.trim() === "") {
        fetchActiveStaffPaginated(10, 0, true);
      } else {
        searchActiveStaff(value, 50);
      }
    }, 250);
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (!isFetchingActiveStaff) fetchActiveStaffPaginated();
    }
  };

  // refresh current date/time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date().toISOString().split("T")[0]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      setSelectedUser(data);
      setFormData({
        date: data.date || "",
        stationId: data.stationId || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        staffName: data.staffName || "",
        id: data.id || "",
        totalHour: data.totalHour || 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (activeStaffList.length === 0) {
      fetchActiveStaffPaginated(10, 0);
    }
  }, [activeStaffList.length, fetchActiveStaffPaginated]);

  useEffect(() => {
    if (stationList.length === 0) {
      fetchStationList();
    }
  }, [stationList.length, fetchStationList]);

  useEffect(() => {
    if (isOpenModal) fetchStationList();
  }, [isOpenModal, fetchStationList]);

  const activeStations =
    stationList?.filter((s) => (s.status || "").toUpperCase() === "ACTIVE") ||
    [];

  const [formData, setFormData] = useState({
    date: data?.date || "",
    stationId: data?.stationId || "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    staffName: data?.staffName || "",
    id: data?.id || "",
    totalHour: data?.totalHour || 0,
  });

  if (!isOpenModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Remove the error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      date: "",
      stationId: "",
      startTime: "",
      endTime: "",
      staffName: "",
      id: "",
      totalHour: 0,
    });
  };

  const toAUFormat = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const timeToFloat = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  const validateForm = () => {
    const newErrors = {};

    // Staff selected
    if (!selectedUser) newErrors.selectedUser = "Please select a staff member";

    // Date
    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const today = new Date();
      const [year, month, day] = formData.date.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day);

      if (selectedDate > today) {
        newErrors.date = "Selected date cannot be in the future";
      }
    }

    // Station
    if (!formData.stationId) newErrors.stationId = "Please select a station";

    // Clock-in / Clock-out
    if (!formData.startTime)
      newErrors.startTime = "Please select clock-in time";
    if (!formData.endTime) newErrors.endTime = "Please select clock-out time";

    // Future datetime check
    if (formData.date && formData.startTime) {
      const [year, month, day] = formData.date.split("-").map(Number);
      const [startHour, startMin] = formData.startTime.split(":").map(Number);
      const startDateTime = new Date(year, month - 1, day, startHour, startMin);

      if (startDateTime > new Date()) {
        newErrors.startTime = "Clock-in cannot be in the future";
      }
    }

    if (formData.date && formData.endTime) {
      const [year, month, day] = formData.date.split("-").map(Number);
      const [endHour, endMin] = formData.endTime.split(":").map(Number);
      const endDateTime = new Date(year, month - 1, day, endHour, endMin);

      if (endDateTime > new Date()) {
        newErrors.endTime = "Clock-out cannot be in the future";
      }
    }

    // Override reason
    if (!formData.overrideReason)
      newErrors.overrideReason = "Please select an override reason";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (selectedUser.type === "Full-time" || selectedUser.type === "Casual") {
      if (
        timeToFloat(formData.endTime) -
          timeToFloat(formData.startTime) +
          selectedUser.totalHour >
        38
      ) {
        return toast.error(
          `Cannot save shift. Exceeds 38 hours weekly. Current: ${selectedUser.totalHour}`
        );
      }
    } else if (selectedUser.type === "Part-time") {
      if (
        timeToFloat(formData.endTime) -
          timeToFloat(formData.startTime) +
          selectedUser.totalHour >
        20
      ) {
        return toast.error(
          `Cannot save shift. Exceeds 20 hours weekly. Current: ${selectedUser.totalHour}`
        );
      }
    }

    const formatDateTime = (date, time) => {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year} ${time}`;
    };

    const shiftHours =
      timeToFloat(formData.endTime) - timeToFloat(formData.startTime);
    const breakMinutes = Math.floor(shiftHours / 4) * 30;

    const payload = {
      employeeId: selectedUser.employeeId,
      clockInTime: formatDateTime(formData.date, formData.startTime),
      clockOutTime: formatDateTime(formData.date, formData.endTime),
      stationId: formData.stationId,
      breakMinutes: breakMinutes,
      reasonCode: formData.overrideReason,
    };

    try {
      await createAttendance(payload);
      toast.success("Attendance created successfully!");
      resetForm();
      setIsOpenModal(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.body || "Failed to create attendance!"
      );
      console.error("Create attendance error:", error);
    }

    if (onSubmitFunction && selectedUser) {
      onSubmitFunction(
        toAUFormat(formData.date),
        selectedUser.id,
        selectedUser.firstName + " " + selectedUser.lastName,
        formData.stationId,
        formData.startTime,
        formData.endTime,
        selectedUser.type,
        selectedUser.payRate,
        selectedUser.totalHour +
          timeToFloat(formData.endTime) -
          timeToFloat(formData.startTime)
      );
    }

    resetForm();
  };

  const openCalendar = () => {
    if (inputRef.current) {
      if (inputRef.current.showPicker) inputRef.current.showPicker();
      else inputRef.current.focus();
    }
  };

  // Generate 30-min interval time options
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

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-999"
      onMouseDown={handleCloseModal}
    >
      <div className="bg-white rounded-lg p-6 relative w-[977px] shadow-lg text-[#565656] z-10">
        <h2 className="text-xl font-semibold text-[#566074] mb-4">{title}</h2>

        <div className="grid grid-cols-2 gap-4 border-y-[1px] border-[#ADADAD] p-2">
          {/* LEFT FORM */}
          <div className="p-2 flex flex-col gap-8">
            {/* Staff info */}
            <div className="w-full flex gap-8 items-center">
              <img src={Avatar} className="size-[100px]" alt="avatar" />
              {selectedUser ? (
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[24px] font-semibold text-[#566074]">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </span>
                  <span className="text-[#ADADAD]">
                    {selectedUser.contractType} Pay rate: $
                    {selectedUser.payRate}/hr
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-[4px]">
                  {errors.selectedUser && (
                    <span className="text-red-500 text-sm">
                      {errors.selectedUser}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="flex flex-col gap-6">
              {/* Date */}
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="date" className="text-[#565656] font-medium">
                  Date
                </label>
                <div className="relative border-[1px] border-[#ADADAD] rounded-[5px] flex items-center">
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
                    className={`input bg-white focus:outline-none placeholder:text-[#ADADAD] w-full rounded-[5px] border ${
                      errors.date ? "border-red-500" : "border-[#ADADAD]"
                    }`}
                  />
                  <img
                    src={Calendar}
                    alt="calendar"
                    className="size-[15px] mr-[3px]"
                    onClick={openCalendar}
                  />
                  <input
                    ref={inputRef}
                    type="date"
                    name="date"
                    onChange={handleChange}
                    value={formData.date}
                    lang="en-AU"
                    max={today}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
                {errors.date && (
                  <span className="text-red-500 text-sm">{errors.date}</span>
                )}
              </div>

              {/* Station */}
              <div className="flex flex-col gap-[10px]">
                <label
                  htmlFor="stationId"
                  className="text-[#565656] font-medium"
                >
                  Station
                </label>
                <select
                  name="stationId"
                  id="stationId"
                  value={formData.stationId}
                  onChange={handleChange}
                  className={`border px-3 py-2 rounded ${
                    errors.stationId ? "border-red-500" : "border-[#ADADAD]"
                  }`}
                >
                  <option value="">Select Station</option>
                  {stationLoading ? (
                    <option disabled>Loading stations...</option>
                  ) : (
                    activeStations.map((station) => (
                      <option key={station.stationId} value={station.stationId}>
                        {station.stationName}
                      </option>
                    ))
                  )}
                </select>
                {errors.stationId && (
                  <span className="text-red-500 text-sm">
                    {errors.stationId}
                  </span>
                )}
              </div>

              {/* Time selectors */}
              <div className="grid grid-cols-2 gap-[36px]">
                {/* Start time */}
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="startTime"
                    className="text-[#565656] font-medium"
                  >
                    Clock-in
                  </label>
                  <select
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        startTime: newStart,
                        endTime:
                          prev.endTime && prev.endTime <= newStart
                            ? ""
                            : prev.endTime,
                      }));

                      // Clear startTime error if exists
                      if (errors.startTime) {
                        setErrors((prev) => ({ ...prev, startTime: null }));
                      }

                      // Also clear endTime error because resetting endTime may resolve it
                      if (errors.endTime) {
                        setErrors((prev) => ({ ...prev, endTime: null }));
                      }
                    }}
                    className={`border border-[#ADADAD] rounded-[5px] px-3 py-2 w-full bg-white ${
                      errors.startTime ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select clock-in time</option>
                    {times.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <span className="text-red-500 text-sm">
                      {errors.startTime}
                    </span>
                  )}
                </div>

                {/* End time */}
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="endTime"
                    className="text-[#565656] font-medium"
                  >
                    Clock-out
                  </label>
                  <select
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`border border-[#ADADAD] rounded-[5px] px-3 py-2 w-full bg-white ${
                      errors.endTime ? "border-red-500" : ""
                    }`}
                    disabled={!formData.startTime}
                  >
                    <option value="">Select clock-out time</option>
                    {times.map((t) => (
                      <option
                        key={t}
                        value={t}
                        disabled={formData.startTime && t <= formData.startTime}
                        className={
                          formData.startTime && t <= formData.startTime
                            ? "text-gray-400"
                            : "text-black"
                        }
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.endTime && (
                    <span className="text-red-500 text-sm">
                      {errors.endTime}
                    </span>
                  )}
                </div>

                {/* Override reason */}
                <div className="flex flex-col gap-[10px] col-span-2">
                  <label
                    htmlFor="overrideReason"
                    className="text-[#565656] font-medium"
                  >
                    Override Reason
                  </label>
                  <select
                    name="overrideReason"
                    id="overrideReason"
                    value={formData.overrideReason || ""}
                    onChange={handleChange}
                    className={`border border-[#ADADAD] rounded-[5px] px-3 py-2 w-full ${
                      errors.overrideReason ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select reason</option>
                    <option value="Card Failure">Card Failure</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Missing clocking">Missing clocking</option>
                    <option value="Not Rostered">Not Rostered</option>
                  </select>
                  {errors.overrideReason && (
                    <span className="text-red-500 text-sm">
                      {errors.overrideReason}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT STAFF LIST */}
          <div className="p-4 flex flex-col gap-[16px] border-l-[1px] border-[#ADADAD]">
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-semibold text-[#566074]">
                Active Staff
              </span>
            </div>

            {/* Search bar */}
            <label className="w-full h-[50px] border-[#E8E8E8] border p-2 rounded-[5px] flex items-center">
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

            {/* Scrollable list */}
            <div
              className="w-full h-[400px] overflow-y-auto flex flex-col"
              onScroll={handleScroll}
            >
              {activeStaffList?.map((staff) => (
                <div
                  key={staff.id}
                  className={`p-2 flex gap-[14px] items-center cursor-pointer ${
                    selectedUser?.id === staff.id ? "bg-[#F0FDF4]" : ""
                  }`}
                  onClick={() => {
                    setSelectedUser(staff);
                    if (errors.selectedUser) {
                      setErrors((prev) => ({ ...prev, selectedUser: null }));
                    }
                  }}
                >
                  <img src={Avatar} alt="avatar" className="size-[60px]" />
                  <div className="flex flex-col">
                    <span
                      className={`text-[14px] font-semibold ${
                        selectedUser?.id === staff.id
                          ? "text-[#16A34A]"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {staff.firstName} {staff.lastName}
                    </span>
                    <span
                      className={`text-[12px] ${
                        selectedUser?.id === staff.id
                          ? "text-[#16A34A]"
                          : "text-[#ADADAD]"
                      }`}
                    >
                      {staff.contractType} Pay rate: ${staff.payRate}/hr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-2 pt-6">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded text-[#565656] cursor-pointer"
            onClick={handleCloseModal}
          >
            Cancel
          </button>

          <ConfirmModal
            propID="createTimeSheet"
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            title="Confirm create shift"
            message="Are you sure all information are correct?"
            handleSubmit={handleSubmit}
            submitLabel={submitLabel}
          />
        </div>
      </div>
    </div>
  );
}

export default AttendanceModal;
