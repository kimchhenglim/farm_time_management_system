import React, { useState, useEffect } from "react";
import Filter from "../assets/filter.svg";
import Add from "../assets/add.svg";
import AscSort from "../assets/ascsort.svg";
import DescSort from "../assets/descsort.svg";
import CreateStaffModal from "../modals/CreateStaffModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useNavigate } from "react-router-dom";

function StaffManagement() {
  const [staffList, setStaffList] = useState([
    {
      id: "001",
      name: "Jasmine Lee",
      role: "Technician",
      contract: "Full-Time",
      payRate: "$42/hr",
      task: "Sensor Calibration",
      shift: "Aug 25, 08:00–16:00",
      status: "Active",
    },
    {
      id: "002",
      name: "Marco Tan",
      role: "Supervisor",
      contract: "Part-Time",
      payRate: "$55/hr",
      task: "System Check",
      shift: "Aug 25, 12:00–20:00",
      status: "Inactive",
    },
    {
      id: "003",
      name: "Aiden Clarke",
      role: "Field Engineer",
      contract: "Full-Time",
      payRate: "$48/hr",
      task: "Equipment Diagnostics",
      shift: "Aug 26, 07:00–15:00",
      status: "Active",
    },
    {
      id: "004",
      name: "Sofia Nguyen",
      role: "Data Analyst",
      contract: "Part-Time",
      payRate: "$38/hr",
      task: "Sensor Data Review",
      shift: "Aug 26, 14:00–20:00",
      status: "Inactive",
    },
  ]);

  // const [staffList, setStaffList] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [isOpenModal, setIsOpenModal] = useState(false);

  // Sorting function
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedStaff = [...staffList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "payRate") {
      aVal = parseFloat(aVal.replace(/[^0-9.]/g, ""));
      bVal = parseFloat(bVal.replace(/[^0-9.]/g, ""));
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <img src={AscSort} alt="Ascending Sort" className="w-8 h-10" />
      ) : (
        <img src={DescSort} alt="Descending Sort" className="w-8 h-10" />
      );
    }
    return <img src={AscSort} alt="Sort" className="w-8 h-10 opacity-30" />;
  };

  const handleAddStaff = (formPayload) => {
    setPendingPayload(formPayload);
    setConfirmType("confirm");
    setIsConfirmOpen(true);
  };

  const confirmAddStaff = async () => {
    try {
      // Convert FormData to plain object
      const obj = Object.fromEntries(pendingPayload.entries());

      // If any numeric field, convert to number
      if (obj.payRate)
        obj.payRate = parseFloat(obj.payRate.replace(/[^0-9.]/g, ""));

      // Send to backend as JSON
      const response = await fetch("backend api for adding staff", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to register staff");

      // Close modal and refresh staff list
      setIsOpenModal(false);
      await fetchStaffList();

      // Show success confirmation
      setConfirmType("success");
      setPendingPayload(null);
      setTimeout(() => setIsConfirmOpen(false), 2000);
    } catch (error) {
      console.error("Error submitting staff:", error);
      alert("Failed to register staff. Please try again.");
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await fetch("backend api for get staff list");
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  const navigate = useNavigate();

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("confirm");
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const API = import.meta.env.VITE_BASE_API;

  return (
    <div className="p-4">
      <div className="flex pb-[32px] gap-10">
        <span className="font-semibold text-[#566074] text-[32px]">
          Staff List
        </span>
        <div className="flex gap-6">
          <button className="flex items-center gap-1 bg-[#F5F5F5] px-4 py-3 rounded-[5px] cursor-pointer">
            <img src={Filter} alt="filter" className="w-4 h-4" />
            <div className="text-[#566074] font-medium">Filter</div>
          </button>
          <button
            className="flex items-center gap-2 bg-[#16A34A] px-4 py-3 rounded-[5px] cursor-pointer"
            onClick={() => {
              setIsOpenModal(true);
            }}
          >
            <img src={Add} alt="add" />
            <div className="text-white font-semibold">Register New Staff</div>
          </button>
          {/* Search Bar */}
          <form className="flex-1">
            <label htmlFor="default-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search something here..."
                style={{ backgroundColor: "#F7F8FA" }}
                className="block w-[571px] h-[52px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </form>
        </div>
      </div>
      <div className="rounded-[20px] overflow-hidden border border-[#D6D6D6]">
        <table className="table-auto w-full">
          <thead className="text-center text-sm text-[#ADADAD] border-[#D6D6D6]">
            <tr>
              {[
                { label: "ID", key: "id" },
                { label: "Name", key: "name" },
                { label: "Role", key: "role" },
                { label: "Contract", key: "contract" },
                { label: "Pay Rate", key: "payRate" },
                { label: "Task", key: "task" },
                { label: "Upcoming Shift", key: "shift" },
                { label: "Status", key: "status" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-4 py-2 border-b border-[#D6D6D6] font-normal cursor-pointer select-none hover:text-[#566074]"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center justify-center gap-1">
                    {label}
                    {renderSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {sortedStaff.map((person) => {
              const statusColor =
                person.status === "Active"
                  ? "bg-[#F0FDF4] text-[#16A34A]"
                  : "bg-[#F5F5F5] text-[#566074]";
              return (
                <tr
                  key={person.id}
                  onClick={() =>
                    navigate(`/staff-management/staff/${person.id}`)
                  }
                  className="text-[#565656] hover:bg-[#FBFBFB] transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-4 py-2 border-b border-[#D6D6D6] text-[#ADADAD]">
                    {person.id}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6] font-semibold">
                    {person.name}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.role}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.contract}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.payRate}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.task}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.shift}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${statusColor}`}
                    >
                      {person.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CreateStaffModal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        onClose={() => {
          setIsOpenModal(false);
        }}
        onSubmit={handleAddStaff}
      />
      <ConfirmationModal
        title="Confirm Registration"
        message="Are you sure you want to register this staff?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmAddStaff}
        onClose={() => {
          setIsConfirmOpen(false);
          setPendingPayload(null);
        }}
      />
    </div>
  );
}

export default StaffManagement;
