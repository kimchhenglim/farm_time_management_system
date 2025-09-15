import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmationModal";
import Filter from "../assets/filter.svg";
import DropDown from "../assets/dropdown.svg";
import Avatar from "../assets/avatar.svg";
import Search from "../assets/search.svg";
import useRosterStore from "../stores/useRosterStore";
import Calendar from "../assets/calendar.svg";
import { axiosInstances } from "../libs/axios";
import useStaffStore from "../stores/useStaffStore";
import { mergeConfig } from "axios";

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

  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  const [formData, setFormData] = useState({
    date: data?.date || "",
    location: data?.location || "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    staffName: data?.staffName || "",
    id: data?.id || "",
    totalHour: data?.totalHour || "",
  });

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
      searchActiveStaff(value, 50);
    }, 250);
  };

  // Refresh date/time every minute
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
    if (!isOpenModal) return;

    if (data && activeStaffList.length) {
      const staff = activeStaffList.find(
        (s) => s.employeeId === data.employeeId
      );

      if (staff) {
        setSelectedUser(staff);
        setFormData({
          date: data.date || "",
          location: data.location || "",
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
    fetchActiveStaffPaginated();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      // store ISO format for input value
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedUser(null);
      setFormData({
        date: "",
        location: "",
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

  const openCalendar = () => {
    if (inputRef.current) {
      if (inputRef.current.showPicker) inputRef.current.showPicker();
      else inputRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations...
    if (!selectedUser) return toast.error("Please select staff!");
    if (!formData.date) return toast.error("Please enter date");
    if (toAUFormat(formData.date) < today)
      return toast.error("You cannot assign or edit shift in the past!");
    if (!formData.location) return toast.error("Please enter location!");
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
      location: formData.location,
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
      location: "",
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
      {/* open register staff modal */}
      <div className="bg-white rounded-lg p-6 relative w-[977px] shadow-lg text-[#565656] z-10">
        <h2 className="text-xl font-semibold text-[#566074] mb-4">{title}</h2>
        {/* <div className="h-[1px] w-full bg-[#ADADAD] px-[-24px] absolute top-[60px] left-0"></div> */}
        <div>
          <div className="grid grid-cols-2 gap-4 border-y-[1px] border-[#ADADAD] p-2">
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
                        " " +
                        "Pay rate: " +
                        "$" +
                        selectedUser.payRate +
                        "/hr"}
                    </span>
                  </div>
                ) : (
                  <button className="p-2 bg-[#F5F5F5] h-[41px] w-[112px] rounded-[5px] font-medium text-[#566074] border-[#DEDEDE] border-[1px] border-solid">
                    Assign staff
                  </button>
                )}
              </div>
              {/* form */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-[10px]">
                  <label htmlFor="date" className="text-[#565656] font-medium">
                    Date
                  </label>
                  <div className="relative border-[1px] border-[#ADADAD] rounded-[5px] flex items-center">
                    {/* Styled text field to show AU format */}
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
                    {/* image */}
                    <img
                      src={Calendar}
                      alt="calendar"
                      className="size-[15px] mr-[3px]"
                    />
                    {/* Transparent date input overlay */}
                    <input
                      ref={inputRef}
                      type="date"
                      name="date"
                      onChange={handleChange}
                      value={formData.date}
                      lang="en-AU"
                      className="absolute top-0 left-0 w-full h-full opacity-0  cursor-pointer z-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label
                    htmlFor="location"
                    className="text-[#565656] font-medium"
                  >
                    Location
                  </label>
                  <select
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="border border-[#ADADAD] px-3 py-2 rounded"
                  >
                    <option value="">Select Location</option>
                    <option value="Shed 1">Shed 1</option>
                    <option value="Shed 2">Shed 2</option>
                    <option value="Shed 3">Shed 3</option>
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
                      htmlFor="startTime"
                      className="text-[#565656] font-medium"
                    >
                      End time
                    </label>
                    <input
                      type="time"
                      className="input bg-white placeholder:text-[#ADADAD] border-[1px] border-[#ADADAD] rounded-[5px] w-full"
                      id="endTime"
                      name="endTime"
                      onChange={handleChange}
                      value={formData.endTime}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Active Staff */}
            <div className="p-4 flex flex-col gap-[16px] border-l-[1px] border-[#ADADAD]">
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-semibold text-[#566074]">
                  Active Staff
                </span>
                {/* <div className="flex gap-[8px] p-2 bg-[#F5F5F5] rounded-[5px] cursor-pointer">
                  <img src={Filter} alt="Filter" className="size-[20px]" />
                  <img src={DropDown} alt="dropdown" className="size-[20px]" />
                </div> */}
              </div>
              <label className="w-full h-[50px] border-[#E8E8E8] border p-2 rounded-[5px] flex items-center">
                {/* search */}
                <div className="flex items-center gap-[10px] w-full">
                  <img src={Search} alt="search" className="size-[15px]" />
                  <input
                    type="text"
                    className="outline-none w-full"
                    name="search"
                    id="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </label>

              {/* Active Staff list with scroll */}
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
                setSelectedUser(null);
                onClose();
              }}
            >
              Cancel
            </button>

            <ConfirmModal
              propID="createShift"
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
      {/* popup */}
    </div>
  );
}

export default ShiftModal;
