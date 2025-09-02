import React, { useState, useEffect } from "react";
import Filter from "../assets/filter.svg";
import Add from "../assets/add.svg";
import AscSort from "../assets/ascsort.svg";
import DescSort from "../assets/descsort.svg";
import CreateStaffModal from "../modals/CreateStaffModal";
import { axiosInstances } from "../libs/axios";
import { useNavigate } from "react-router-dom";
import useStaffStore from "../stores/useStaffStore";

function StaffManagement() {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isOpenModal, setIsOpenModal] = useState(false);
  //import from useStaffStore
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const { staffList, fetchStaffList } = useStaffStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    setFilteredStaff(staffList);
  }, [staffList]);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedStaff = Array.isArray(filteredStaff)
    ? [...filteredStaff].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "name") {
          aVal = `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase();
          bVal = `${b.firstName ?? ""} ${b.lastName ?? ""}`.toLowerCase();
        }

        if (sortConfig.key === "payRate") {
          aVal = parseFloat(String(aVal).replace(/[^0-9.]/g, ""));
          bVal = parseFloat(String(bVal).replace(/[^0-9.]/g, ""));
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <img src={AscSort} alt="Ascending Sort" className="w-6 h-7" />
      ) : (
        <img src={DescSort} alt="Descending Sort" className="w-6 h-7" />
      );
    }
    return <img src={AscSort} alt="Sort" className="w-6 h-7 opacity-30" />;
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = staffList.filter((staff) => {
      const fullName = `${staff.firstName ?? ""} ${
        staff.lastName ?? ""
      }`.toLowerCase();
      const id = String(staff.id).toLowerCase();
      return fullName.includes(query) || id.includes(query);
    });

    setFilteredStaff(filtered);
  };

  // Handle POST
  const handleAddStaff = async (payload) => {
    try {
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      const token = authUser?.body.loginToken;

      console.log(token);

      await axiosInstances.post("/admin/register", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchStaffList();
    } catch (error) {
      alert("Failed to register staff. Please try again.");
    }
  };

  // Filter dropdown options
  const filterOptions = [
    { label: "Active Staff", key: "isActive", value: true },
    { label: "Inactive Staff", key: "isActive", value: false },
    { label: "Full-Time", key: "contractType", value: "FULLTIME" },
    { label: "Part-Time", key: "contractType", value: "PARTTIME" },
    { label: "Casual", key: "contractType", value: "CASUAL" },
  ];

  const handleFilterClick = (option) => {
    const filtered = staffList.filter(
      (staff) => staff[option.key] === option.value
    );
    setFilteredStaff(filtered);
    setShowFilterDropdown(false);
  };

  return (
    <div className="p-4 bg-[#F4F6F8]">
      <div className="flex pb-[32px] gap-10">
        <span className="font-semibold text-[#566074] text-[32px]">
          Staff List
        </span>
        <div className="flex gap-6 relative">
          {/* Filter Button */}
          <div className="relative">
            <button
              className="flex items-center gap-1 bg-[#e3e3e3] hover:bg-[#d4d4d4] px-4 py-3 rounded-[5px] cursor-pointer"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <img src={Filter} alt="filter" className="w-4 h-4" />
              <div className="text-[#566074] font-medium">Filter</div>
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full mt-1 right-0 text-black bg-white border border-gray-200 shadow-lg rounded w-44 z-50">
                {filterOptions.map((option) => (
                  <div
                    key={option.label}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleFilterClick(option)}
                  >
                    {option.label}
                  </div>
                ))}
                {/* Reset Filter */}
                <div
                  className="px-4 py-2 text-red-500 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setFilteredStaff(staffList);
                    setShowFilterDropdown(false);
                  }}
                >
                  Reset Filter
                </div>
              </div>
            )}
          </div>

          {/* Register Staff Button */}
          <button
            className="flex items-center gap-2 bg-[#16A34A] px-4 py-3 rounded-[5px] cursor-pointer"
            onClick={() => setIsOpenModal(true)}
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
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={handleSearch}
                style={{ backgroundColor: "#F7F8FA" }}
                className="block w-[571px] h-[52px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"
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
                { label: "Contract", key: "contractType" },
                { label: "Pay Rate", key: "payRate" },
                { label: "Location", key: "location" },
                { label: "Upcoming Shift", key: "upcomingShift" },
                { label: "Status", key: "status" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-4 py-2 border-b border-[#D6D6D6] font-normal cursor-pointer select-none hover:text-[#566074]"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center justify-center">
                    {label}
                    {renderSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {sortedStaff.map((person) => {
              const statusColor = person.isActive
                ? "bg-[#F0FDF4] text-[#16A34A]"
                : "bg-[#F5F5F5] text-[#566074]";
              return (
                <tr
                  key={person.id}
                  onClick={() =>
                    navigate(`/staff-management/staff/${person.id}`)
                  }
                  className="text-[#565656] hover:bg-[#e4e4e4] transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-4 py-2 border-b border-[#D6D6D6] text-[#ADADAD]">
                    FT{person.id}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6] font-semibold">
                    {person.firstName} {person.lastName}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.role}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.contractType}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.payRate ? `$${person.payRate}/hr` : ""}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.location}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    {person.upComingShift}
                  </td>
                  <td className="px-4 py-2 border-b border-[#D6D6D6]">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${statusColor}`}
                    >
                      {person.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CreateStaffModal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSubmit={handleAddStaff} // POST payload directly
      />
    </div>
  );
}

export default StaffManagement;
