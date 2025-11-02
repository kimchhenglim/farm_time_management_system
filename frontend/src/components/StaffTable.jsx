import React, { useEffect, useMemo, useState } from "react";
import useAttendanceStore from "../stores/useAttendanceStore";
import AttendanceModal from "../modals/AttendanceModal";
function StaffTable({ weekStart, weekEnd, onRowClick }) {
  // for modal create
  const [isModalOpen, setIsModalOpen] = useState(false);
  //using useAttendanceStore
  const {
    fetchStaffTable,
    page,
    totalPages,
    totalElements,
    staffTable,
    createAttendance,
  } = useAttendanceStore();
  //using useEffect to get the data for staffTable
  useEffect(() => {
    fetchStaffTable(weekStart, weekEnd, page, 10); // Fetch page 0 with size 10 on mount
  }, [fetchStaffTable, weekEnd, weekStart]);
  console.log(staffTable);
  // Sorting state
  const [sortKey, setSortKey] = useState(null);
  const [direction, setDirection] = useState("asc");

  // Pagination state
  // const [page, setPage] = useState(0);
  const pageSize = 10;

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

  // useMemo is used for “Only redo this calculation when it’s really necessary or when the dependencies changed"
  const sortedStaff = useMemo(() => {
    if (!sortKey) return staffTable;

    // this return will shallow copy the array of staffTable and modify with the sort() function
    return [...staffTable].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      // 🧠 If sorting by date, convert to Date objects first
      if (sortKey === "date") {
        // handle strings like "Mon 06 Oct 2025"
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // If sorting by numeric field, ensure they're numbers
      if (["payRate", "hours", "total", "breakMinutes"].includes(sortKey)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [staffTable, sortKey, direction]);

  // Pagination handlers
  const handlePrevPage = () => setPage(Math.max(0, page - 1));
  const handleNextPage = () => setPage(page + 1 < totalPages ? page + 1 : page);
  // Checkbox handlers
  const currentPageStaff = sortedStaff.slice(
    page * pageSize,
    page * pageSize + pageSize
  );
  console.log(currentPageStaff);
  const totalAmount = staffTable.reduce((sum, staff) => {
    return sum + staff.total;
  }, 0);
  return (
    <div>
      {/* Summary + Button */}
      <div className="w-full flex justify-between items-center cursor-pointer mb-[24px]">
        <div className="font-thin text-[#8D8D8D] flex gap-[44px]">
          <span>
            {staffTable.length}{" "}
            {staffTable.length > 1 ? "timesheets" : "timesheet"}
          </span>
          <span>${totalAmount}</span>
        </div>
        <div className="flex gap-6 items-center justify-center">
          <div
            className="flex justify-center items-center gap-[12px] px-[40px] py-[16px] border-[#16A34A] border-2 rounded-md text-[#16A34A] font-semibold text-[16px]"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5C8 0.946875 7.55312 0.5 7 0.5C6.44688 0.5 6 0.946875 6 1.5V6.5H1C0.446875 6.5 0 6.94688 0 7.5C0 8.05312 0.446875 8.5 1 8.5H6V13.5C6 14.0531 6.44688 14.5 7 14.5C7.55312 14.5 8 14.0531 8 13.5V8.5H13C13.5531 8.5 14 8.05312 14 7.5C14 6.94688 13.5531 6.5 13 6.5H8V1.5Z"
                fill="#16A34A"
              />
            </svg>
            New record
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[20px] overflow-hidden border border-[#D6D6D6]">
        <table className="table-auto w-full">
          <thead className="text-center text-sm text-[#ADADAD] border-[#D6D6D6]">
            <tr>
              {[
                { label: "Date", key: "date" },
                { label: "Staff", key: "employeeName" },
                { label: "Clock-in", key: "clockInTime" },
                { label: "Clock-out", key: "clockOutTime" },
                { label: "Break", key: "breakMinutes" },
                { label: "Pay rate", key: "payRate" },
                { label: "Hours", key: "hours" },
                { label: "Total", key: "total" },
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
                    onClick={() => onRowClick && onRowClick(person)}
                    className="text-[#565656] hover:bg-[#e4e4e4] transition-colors duration-200 p-10 cursor-pointer"
                  >
                    {/* Row data */}
                    <td className=" border-b border-[#D6D6D6] text-[#ADADAD]">
                      {person.date}
                    </td>
                    <td className=" border-b border-[#D6D6D6] font-semibold">
                      {person.employeeName}
                    </td>
                    <td className=" border-b border-[#D6D6D6]  ">
                      <div className="flex gap-2 items-center justify-center">
                        <span>{person.clockInTime}</span>
                      </div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      <div className="flex gap-2 items-center justify-center">
                        <span>{person.clockOutTime}</span>
                      </div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      <div className="flex gap-2 items-center justify-center">
                        <span>
                          {person.breakMinutes ? person.breakMinutes : "—"}
                        </span>
                      </div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      ${person.payRate}
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      {person.hours}
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      ${person.total}
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
            of <span className="font-semibold">{numberOfElements}</span> Entries
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
      {/* Modal */}
      <AttendanceModal
        isOpenModal={isModalOpen}
        setIsOpenModal={setIsModalOpen}
        title="Create New Attendance"
        onClose={() => setIsModalOpen(false)}
        onSubmitFunction=""
        submitLabel="Save"
      />
    </div>
  );
}

export default StaffTable;
