import React, { useEffect, useState, useRef } from "react";
import useStationStore from "../stores/useStationStore";
import Avatar from "../assets/avatar.svg";
import useAttendanceStore from "../stores/useAttendanceStore";
import ConfirmModal from "./ConfirmationModal";
import toast from "react-hot-toast";

export default function EditAttendanceModal({ isOpen, setIsOpen, data }) {
  const { stationList, fetchStationList, stationLoading } = useStationStore();
  const { updateAttendance, deleteAttendance } = useAttendanceStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    date: data?.date || "",
    stationId: data?.stationId || "",
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    breakMinutes: data?.breakMinutes || 0,
    breakReason: data?.breakReason || "",
    reasonCode: data?.reasonCode || "Meal",
  });

  useEffect(() => {
    if (stationList.length === 0) fetchStationList();
  }, [stationList.length, fetchStationList]);

  const parseDateToInput = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split(" "); // ["Mon", "06", "Oct", "2025"]
    if (parts.length !== 4) return "";
    const day = parts[1];
    const monthStr = parts[2];
    const year = parts[3];

    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const month = monthMap[monthStr] || "01";
    return `${year}-${month}-${day.padStart(2, "0")}`;
  };

  // Convert time "HH:MM" to float hours
  const timeToFloat = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  // Recalculate break minutes whenever start or end time changes
  useEffect(() => {
    const { startTime, endTime } = formData;
    if (startTime && endTime) {
      const duration = timeToFloat(endTime) - timeToFloat(startTime);
      if (duration >= 4) {
        const breakMins = Math.floor(duration / 4) * 30;
        setFormData((prev) => ({ ...prev, breakMinutes: breakMins }));
      } else {
        setFormData((prev) => ({ ...prev, breakMinutes: 0 }));
      }
    } else {
      setFormData((prev) => ({ ...prev, breakMinutes: 0 }));
    }
  }, [formData.startTime, formData.endTime]);

  useEffect(() => {
    if (data) {
      setFormData({
        date: parseDateToInput(data.date),
        stationId: data.stationId || "",
        startTime: data.clockInTime || data.startTime || "",
        endTime: data.clockOutTime || data.endTime || "",
        breakMinutes: data.breakMinutes || 0,
        breakReason: data.reasonCode || "",
        reasonCode: "",
      });
    }
  }, [data]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => setIsOpen(false);

  const handleSave = async () => {
    if (!data?.id) return toast.error("Missing clocking ID");

    if (!formData.date || !formData.startTime || !formData.endTime) {
      return toast.error("Please fill in date, clock-in, and clock-out times.");
    }

    const formatDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    };

    const payload = {
      employeeId: data.employeeId,
      clockInTime: `${formatDate(formData.date)} ${formData.startTime}`,
      clockOutTime: `${formatDate(formData.date)} ${formData.endTime}`,
      reasonCode: formData.reasonCode || formData.breakReason,
      breakMinutes: formData.breakMinutes,
    };

    try {
      const res = await updateAttendance(data.id, payload);
      if (res) {
        toast.success("Attendance updated successfully!");
        setIsOpen(false);
      } else {
        toast.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating attendance.");
    }
  };

  const handleDelete = async () => {
    if (!data?.id) return toast.error("Missing clocking ID");

    try {
      const res = await deleteAttendance(data.id);
      if (res) {
        toast.success("Attendance deleted successfully!");
        setIsOpen(false);
      } else {
        toast.error("Failed to delete attendance.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting attendance.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] w-[800px] max-w-full p-6 flex flex-col gap-6">
        <h2 className="text-[#566074] font-semibold text-2xl">
          Edit Attendance
        </h2>
        <div className="flex items-center gap-4">
          <img src={Avatar} alt="avatar" className="w-20 h-20 rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {data?.employeeName || "Staff Name"}
            </span>
            {/* <span
              className={`text-sm font-medium ${
                data?.status === "Pending" ? "text-[#566074]" : "text-[#16A34A]"
              }`}
            >
              {data?.status === "Pending"
                ? "Staff not clocked in"
                : "Clocked in"}
            </span> */}
            <span className="text-sm text-gray-400">
              {data?.employmentType || "Contract type"} - Pay rate: $
              {data?.payRate || 0}/hr
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4 mt-4">
          {/* Date */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">Date</label>
            <input
              type="date"
              name="date"
              ref={inputRef}
              value={formData.date}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Station */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">Station</label>
            <select
              name="stationId"
              value={formData.stationId}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select Station</option>
              {stationLoading ? (
                <option disabled>Loading stations...</option>
              ) : (
                stationList.map((s) => (
                  <option key={s.stationId} value={s.stationId}>
                    {s.stationName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Clock-in / Clock-out */}
          <div className="grid grid-cols-2 gap-4">
            {/* Clock-in */}
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Clock-in</label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    startTime: newStart,
                    // Reset endTime if it's before or equal to new start
                    endTime:
                      prev.endTime && prev.endTime <= newStart
                        ? ""
                        : prev.endTime,
                  }));
                }}
                className="p-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select clock-in time</option>
                {Array.from({ length: 24 * 2 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = (i % 2) * 30;
                  const formatted = `${hour
                    .toString()
                    .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                  return (
                    <option key={formatted} value={formatted}>
                      {formatted}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Clock-out */}
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm">Clock-out</label>
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md bg-white"
                disabled={!formData.startTime} // Disable until start selected
              >
                <option value="">Select clock-out time</option>
                {Array.from({ length: 24 * 2 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = (i % 2) * 30;
                  const formatted = `${hour
                    .toString()
                    .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
                  const disabled =
                    formData.startTime && formatted <= formData.startTime;
                  return (
                    <option
                      key={formatted}
                      value={formatted}
                      disabled={disabled}
                      className={disabled ? "text-gray-400" : "text-black"}
                    >
                      {formatted}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Break */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">
              Break (auto-calculated)
            </label>
            <input
              type="text"
              name="breakMinutes"
              value={formData.breakMinutes}
              readOnly
              className="p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Break Reason */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">Break reason</label>
            <input
              type="text"
              name="breakReason"
              value={formData.breakReason}
              readOnly
              className="p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Override Reason */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm">Override Reason</label>
            <select
              name="reasonCode"
              value={formData.reasonCode}
              onChange={(e) => {
                const selected = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  reasonCode: selected,
                }));
              }}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select reason</option>
              <option value="Card Failure">Card Failure</option>
              <option value="Emergency Leave">Emergency Leave</option>
              <option value="Missing clocking">Missing Clocking</option>
              <option value="Not Rostered">Not Rostered</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </button>

          <button
            className="px-6 py-3 bg-red-600 text-white rounded-md cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </button>

          <button
            className="px-6 py-3 bg-green-600 text-white rounded-md cursor-pointer"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
