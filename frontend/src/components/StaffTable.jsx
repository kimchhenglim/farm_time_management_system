import React, { useMemo, useState } from "react";
import ClockIn from "../assets/clockIn.svg";
import ClockOut from "../assets/clockOut.svg";
import Break from "../assets/break.svg";
function StaffTable({ totalElements, totalPages }) {
  const staff = [
    {
      id: 1,
      date: "Mon, 1 Sep 2025",
      staff: "Ly Chingsien",
      clockIn: "08:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 1,
      total: 125.0,
      status: "Pending",
    },
    {
      id: 2,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "08:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 2,
      total: 200.0,
      status: "Pending",
    },
    {
      id: 3,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "08:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 3,
      total: 120.0,
      status: "Pending",
    },
    {
      id: 4,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "08:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 4,
      total: 1200.0,
      status: "Pending",
    },
    {
      id: 5,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "08:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 5,
      total: 120.0,
      status: "Pending",
    },
    {
      id: 6,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "08:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 6,
      total: 120.0,
      status: "Pending",
    },
    {
      id: 7,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "08:59:59",
      clockOut: "23:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 7,
      total: 120.0,
      status: "Pending",
    },
    {
      id: 8,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "12:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 8,
      total: 120.0,
      status: "Approved",
    },
    {
      id: 9,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "11:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 9,
      total: 120.0,
      status: "Approved",
    },
    {
      id: 10,
      date: "Mon, 1 Sep 2025",
      staff: "Ngo Pham Thu Thao",
      clockIn: "23:59:59",
      clockOut: "14:59:59",
      break: "30m",
      payRate: "24.00",
      hours: 10,
      total: 300.0,
      status: "Approved",
    },
  ];
  // Sorting state
  const [sortKey, setSortKey] = useState(null);
  const [direction, setDirection] = useState("asc");

  // Pagination state
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Checkbox state
  const [selectedIds, setSelectedIds] = useState([]);

  // Sort handlers
  const handleSort = (key) => {
    // console.log(key);
    // console.log(sortKey);
    if (sortKey === key) {
      //   console.log("hi");
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      //   console.log("hello");
      setSortKey(key);
      setDirection("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return null;
    return <span className="ml-1">{direction === "asc" ? "▲" : "▼"}</span>;
  };

  const sortedStaff = useMemo(() => {
    if (!sortKey) return staff;
    return [...staff].sort((a, b) => {
      //it will go and compate objectA[staff] and objectB[staff]
      if (a[sortKey] < b[sortKey]) return direction === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [staff, sortKey, direction]);

  // Pagination
  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => (p + 1 < totalPages ? p + 1 : p));

  // Checkbox handlers
  const currentPageStaff = sortedStaff.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const isAllSelected =
    currentPageStaff.length > 0 &&
    currentPageStaff.every((person) => selectedIds.includes(person.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all on current page
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageStaff.some((p) => p.id === id))
      );
    } else {
      // Select all on current page
      setSelectedIds((prev) => [
        ...new Set([...prev, ...currentPageStaff.map((p) => p.id)]),
      ]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  return (
    <div>
      {/* Table */}
      <div className="rounded-[20px] overflow-hidden border border-[#D6D6D6]">
        <table className="table-auto w-full">
          <thead className="text-center text-sm text-[#ADADAD] border-[#D6D6D6]">
            <tr>
              {[
                { label: "Date", key: "date" },
                { label: "Staff", key: "staff" },
                { label: "Clock-in", key: "clockIn" },
                { label: "Clock-out", key: "clockOut" },
                { label: "Break", key: "Break" },
                { label: "Pay rate", key: "payRate" },
                { label: "Hours", key: "hours" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-4 py-6 border-b border-[#D6D6D6] font-normal cursor-pointer select-none hover:text-[#566074]"
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
          <tbody className="text-sm text-center [&>tr>td]:px-6 [&>tr>td]:py-4 ">
            {currentPageStaff.length > 0 ? (
              currentPageStaff.map((person) => {
                const statusColor =
                  person.status !== "Pending"
                    ? "bg-[#F0FDF4] text-[#16A34A]"
                    : "bg-[#F5F5F5] text-[#566074]";
                return (
                  <tr
                    key={person.id}
                    className="text-[#565656] hover:bg-[#e4e4e4] transition-colors duration-200 p-10"
                  >
                    {/* Row data */}
                    <td className=" border-b border-[#D6D6D6] text-[#ADADAD]">
                      {person.date}
                    </td>
                    <td className=" border-b border-[#D6D6D6] font-semibold">
                      {person.staff}
                    </td>
                    <td className=" border-b border-[#D6D6D6]  ">
                      <div className="flex gap-2 items-center justify-center">
                        <img src={ClockIn} alt="clock-in" />
                        <span>{person.clockIn}</span>
                      </div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      <div className="flex gap-2 items-center justify-center">
                        <img src={ClockOut} alt="clock-out" />
                        <span>{person.clockOut}</span>
                      </div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      <div className="flex gap-2 items-center justify-center">
                        <img src={Break} alt="break" />
                        <span>{person.break}</span>
                      </div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      ${person.payRate}
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      {person.hours}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-4 py-6 text-center text-gray-500 font-medium"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedStaff.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          <span className="text-sm text-gray-700">
            Showing <span className="font-semibold">{page * pageSize + 1}</span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(page * pageSize + pageSize, sortedStaff.length)}
            </span>{" "}
            of <span className="font-semibold">{totalElements}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`px-3 h-8 text-sm font-medium rounded-s ${
                page === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
            >
              Prev
            </button>
            <button
              onClick={handleNextPage}
              disabled={page + 1 >= totalPages}
              className={`px-3 h-8 text-sm font-medium rounded-e cursor-pointer ${
                page + 1 >= totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffTable;
