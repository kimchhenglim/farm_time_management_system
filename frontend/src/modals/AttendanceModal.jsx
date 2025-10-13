import React, { useEffect, useRef, useState } from "react";
import useRosterStore from "../stores/useRosterStore";
import Avatar from "../assets/avatar.svg";
import Calendar from "../assets/calendar.svg";
import Filter from "../assets/filter.svg";
import DropDown from "../assets/dropdown.svg";
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
  const { staffActiveList } = useRosterStore();
  const { createAttendance } = useAttendanceStore();
  const { stationList, fetchStationList, stationLoading } = useStationStore();

  const [today, setToday] = useState(
    new Date()
      .toLocaleDateString("en-AU")
      .split("/")
      .map((part) => part.padStart(2, "0"))
      .join("-")
  );
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

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

  // Refresh current date/time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(
        new Date()
          .toLocaleDateString("en-AU")
          .split("/")
          .map((part) => part.padStart(2, "0"))
          .join("-")
      );
      setTime(
        new Date().toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 60 * 1000);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) return toast.error("Please select staff!");
    if (!formData.date) return toast.error("Please enter date");
    if (!formData.stationId) return toast.error("Please select a station!");
    if (!formData.startTime || !formData.endTime)
      return toast.error("Please enter shift time!");
    if (formData.endTime < formData.startTime)
      return toast.error("Start time must not be bigger than End time!");
    if (timeToFloat(formData.endTime) - timeToFloat(formData.startTime) > 12)
      return toast.error("Shift cannot be longer than 12 hours!");

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

    console.log("Payload for attendance:", payload);

    try {
      const res = await createAttendance(payload);
      if (res) {
        toast.success("Attendance created successfully!");
        resetForm();
        setIsOpenModal(false);
      } else {
        toast.error("Failed to create attendance!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
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

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-999"
      onMouseDown={handleCloseModal}
    >
      <div className="bg-white rounded-lg p-6 relative w-[977px] shadow-lg text-[#565656] z-10">
        <h2 className="text-xl font-semibold text-[#566074] mb-4">{title}</h2>
        <div className="grid grid-cols-2 gap-4 border-y-[1px] border-[#ADADAD] p-2">
          {/* Left side form */}
          <div className="p-2 flex flex-col gap-8">
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
                <button className="p-2 bg-[#F5F5F5] h-[41px] w-[112px] rounded-[5px] font-medium text-[#566074] border-[#DEDEDE] border">
                  Assign staff
                </button>
              )}
            </div>

            <div className="flex flex-col gap-6">
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
                  className="border border-[#ADADAD] px-3 py-2 rounded"
                >
                  <option value="">Select Station</option>
                  {stationLoading ? (
                    <option disabled>Loading stations...</option>
                  ) : (
                    stationList.map((station) => (
                      <option key={station.stationId} value={station.stationId}>
                        {station.stationName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-[36px]">
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="startTime"
                    className="text-[#565656] font-medium"
                  >
                    Start time
                  </label>
                  <input
                    type="time"
                    className="input bg-white placeholder:text-[#ADADAD] border-[1px] border-[#ADADAD] rounded-[5px] w-full"
                    id="startTime"
                    value={formData.startTime}
                    name="startTime"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="endTime"
                    className="text-[#565656] font-medium"
                  >
                    End time
                  </label>
                  <input
                    type="time"
                    className="input bg-white placeholder:text-[#ADADAD] border-[1px] border-[#ADADAD] rounded-[5px] w-full"
                    id="endTime"
                    value={formData.endTime}
                    name="endTime"
                    onChange={handleChange}
                  />
                </div>
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
                    className="border-[1px] border-[#ADADAD] rounded-[5px] px-3 py-2 w-full"
                  >
                    <option value="">Select reason</option>
                    <option value="Card Failure">Card Failure</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Missing clocking">Missing clocking</option>
                    <option value="Not Rostered">Not Rostered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right side staff list */}
          <div className="p-4 flex flex-col gap-[16px] border-l-[1px] border-[#ADADAD]">
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-semibold text-[#566074]">
                Active Staff
              </span>
            </div>

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
                  onClick={() => setSelectedUser(staff)}
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
