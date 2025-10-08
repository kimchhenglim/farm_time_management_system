import React, { useEffect, useRef, useState } from "react";
import useRosterStore from "../stores/useRosterStore";
import Avatar from "../assets/avatar.svg";
import Calendar from "../assets/calendar.svg";
import Filter from "../assets/filter.svg";
import DropDown from "../assets/dropdown.svg";
import Search from "../assets/search.svg";
import ConfirmModal from "./ConfirmationModal";
function AttendanceModal({
  isOpenModal,
  setIsOpenModal,
  onClose,
  title,
  data,
  onSubmitFunction,
  submitLabel,
}) {
  // console.log(data);
  const inputRef = useRef(null);
  //create selectedUser to help with assign user
  const [selectedUser, setSelectedUser] = useState(null);
  const { staffActiveList } = useRosterStore();
  const [today, setToday] = useState(
    new Date()
      .toLocaleDateString("en-AU") // "8/9/2025"
      .split("/") // ["8","9","2025"]
      .map((part) => part.padStart(2, "0")) // ["08","09","2025"]
      .join("-") // "08-09-2025"
  );
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
  //use useEffect to check every minute to refresh the date
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
    }, 60 * 1000); // check every 1 min

    setSelectedUser(data);
    return () => clearInterval(interval); // cleanup
  }, [data]); // depend on `data` so selectedUser updates too

  // to re-store data from selectedUser
  useEffect(() => {
    if (data) {
      setSelectedUser(data);
      setFormData({
        date: data.date || "",
        station: data.station || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        staffName: data.staffName || "",
        id: data.id || "",
        totalHour: data.totalHour || "",
      });
    }
  }, [data]); // 👈 run whenever CardRoster passes new data

  const [formData, setFormData] = useState({
    date: data?.date || "",
    station: data?.station || "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    staffName: data?.staffName || "",
    id: data?.id || "",
  });
  if (!isOpenModal) return null;

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
      });
      onClose();
      // console.log(e.target.className);
    }
  };
  //to convert into AU format
  function toAUFormat(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  }
  //convert from string into float for time
  function timeToFloat(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(time);
    // console.log(formData.startTime);
    // console.log(formData.endTime);
    // console.log(
    //   timeToFloat(formData.endTime) - timeToFloat(formData.startTime)
    // );
    if (!selectedUser) {
      toast.error("Please select staff!");
      return;
    } else if (formData.date === "") {
      toast.error("Please enter date");
      return;
    } else if (toAUFormat(formData.date) < today) {
      toast.error("You cannot assign or edit shift in the past!");
      return;
    } else if (formData.station === "") {
      toast.error("Please enter station!");
      return;
    } else if (formData.startTime === "" || formData.endTime === "") {
      toast.error("Please enter shift time!");
      return;
    } else if (formData.startTime < time) {
      //when can end time
      toast.error("Cannot create shift or edit at the past!");
      return;
    } else if (formData.endTime < formData.startTime) {
      //when can end time
      toast.error("Start time must not be bigger than End time!");
      return;
    } else if (
      timeToFloat(formData.endTime) - timeToFloat(formData.startTime) >
      12
    ) {
      toast.error("Shift cannot be longer than 12 hours!");
      return;
    } else if (
      selectedUser.type === "Full-time" ||
      selectedUser.type === "Casual"
    ) {
      if (
        timeToFloat(formData.endTime) -
          timeToFloat(formData.startTime) +
          selectedUser.totalHour >
        38
      ) {
        toast.error(
          "Cannot save shift. This would exceed the weekly limit of 38 hours. Current scheduled hours: " +
            selectedUser.totalHour
        );
        return;
      }
    } else if (selectedUser.type === "Part-time") {
      if (
        timeToFloat(formData.endTime) -
          timeToFloat(formData.startTime) +
          selectedUser.totalHour >
        20
      ) {
        toast.error(
          "Cannot save shift. This would exceed the weekly limit of 20 hours. Current scheduled hours: " +
            selectedUser.totalHour
        );
        return;
      }
    }
    console.log(formData.endTime + formData.startTime);
    setFormData({
      ...formData,
      id: selectedUser.id,
      staffName: selectedUser.staffName,
    });
    //for adding roster
    onSubmitFunction(
      toAUFormat(formData.date),
      selectedUser.id,
      selectedUser.staffName,
      formData.station,
      formData.startTime,
      formData.endTime,
      selectedUser.type,
      selectedUser.payRate,
      selectedUser.totalHour +
        timeToFloat(formData.endTime) -
        timeToFloat(formData.startTime)
    );
    // console.log(selectedUser);
    setIsOpenModal(false);
    setSelectedUser(null);

    setFormData({
      date: "",
      station: "",
      startTime: "",
      endTime: "",
      StaffName: "",
      id: "",
    });
  };
  // console.log(selectedUser);
  //to open the calendar picker
  const openCalendar = () => {
    if (inputRef.current) {
      // modern browsers
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker();
      } else {
        // fallback
        inputRef.current.focus();
      }
    }
  };
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
                      {selectedUser?.staffName}
                    </span>
                    <span className="text-[#ADADAD]">
                      {selectedUser.type +
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
                          ? new Date(formData.date)
                              .toLocaleDateString("en-AU")
                              .split("/")
                              .map((part) => part.padStart(2, "0"))
                              .join("-")
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
                    htmlFor="station"
                    className="text-[#565656] font-medium"
                  >
                    Station
                  </label>
                  <select
                    name="station"
                    id="station"
                    value={formData.station}
                    onChange={handleChange}
                    className="border border-[#ADADAD] px-3 py-2 rounded"
                  >
                    <option value="">Select Station</option>
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
            {/* active Staff */}
            <div className="p-4 flex flex-col gap-[16px] border-l-[1px] border-[#ADADAD]">
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-semibold text-[#566074]">
                  Active Staff
                </span>
                <div className="flex gap-[8px] p-2 bg-[#F5F5F5] rounded-[5px] cursor-pointer">
                  <img src={Filter} alt="Filter" className="size-[20px]" />
                  <img src={DropDown} alt="dropdown" className="size-[20px]" />
                </div>
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
                  />
                </div>
              </label>
              <div className="w-full h-[300px] overflow-y-auto flex flex-col ">
                {/* list of user */}
                {staffActiveList?.map((staff, index) => {
                  return (
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
                          {staff.staffName}
                        </span>
                        <span
                          className={`text-[12px] ${
                            selectedUser?.id === staff.id
                              ? "text-[#16A34A]"
                              : "text-[#ADADAD]"
                          }`}
                        >
                          {staff.type +
                            " " +
                            "Pay rate: " +
                            "$" +
                            staff.payRate +
                            "/hr"}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
      {/* popup */}
    </div>
  );
}

export default AttendanceModal;
