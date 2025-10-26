import React, { useEffect, useMemo, useState } from "react";
import AttendanceModal from "../modals/AttendanceModal";
import useAttendanceStore from "../stores/useAttendanceStore";

function PayrollTable({ weekStart, weekEnd, onRowClick }) {
  // for modal create
  const [isModalOpen, setIsModalOpen] = useState(false);
  //using useAttendanceStore
  const { fetchStaffTable, page, totalPages, totalElements, staffTable } =
    useAttendanceStore();
  // //using useEffect to get the data for staffTable
  // useEffect(() => {
  //   fetchStaffTable(weekStart, weekEnd, 0, 10); // Fetch page 0 with size 10 on mount
  // }, [fetchStaffTable, weekEnd, weekStart]);
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

      // 🧠 If sorting by numeric field, ensure they're numbers
      if (["payRate", "hours", "total", "breakMinutes"].includes(sortKey)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [staffTable, sortKey, direction]);

  // Pagination
  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => (p + 1 < totalPages ? p + 1 : p));

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
          <div className="flex justify-center items-center gap-[12px] px-[40px] py-[16px] border-[#DEDEDE] border-2 rounded-md text-[#566074] bg-[#F5F5F5] font-semibold text-[16px]">
            Export
          </div>
          <div className="flex justify-center items-center gap-[12px] px-[40px] py-[16px] border-[#16A34A] border-2 rounded-md text-[#16A34A] font-semibold text-[16px]">
            <svg
              width="25px"
              height="25px"
              viewBox="0 -4 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
              fill="#16A34A"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>mail</title> <desc>Created with Sketch Beta.</desc>{" "}
                <defs> </defs>{" "}
                <g
                  id="Page-1"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                  sketch:type="MSPage"
                >
                  {" "}
                  <g
                    id="Icon-Set"
                    sketch:type="MSLayerGroup"
                    transform="translate(-412.000000, -259.000000)"
                    fill="#16A34A"
                  >
                    {" "}
                    <path
                      d="M442,279 C442,279.203 441.961,279.395 441.905,279.578 L433,270 L442,263 L442,279 L442,279 Z M415.556,280.946 L424.58,271.33 L428,273.915 L431.272,271.314 L440.444,280.946 C440.301,280.979 415.699,280.979 415.556,280.946 L415.556,280.946 Z M414,279 L414,263 L423,270 L414.095,279.578 C414.039,279.395 414,279.203 414,279 L414,279 Z M441,261 L428,271 L415,261 L441,261 L441,261 Z M440,259 L416,259 C413.791,259 412,260.791 412,263 L412,279 C412,281.209 413.791,283 416,283 L440,283 C442.209,283 444,281.209 444,279 L444,263 C444,260.791 442.209,259 440,259 L440,259 Z"
                      id="mail"
                      sketch:type="MSShapeGroup"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            Send To Staff
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[20px] overflow-hidden border border-[#D6D6D6]">
        <table className="table-auto w-full">
          <thead className="text-center text-sm text-[#ADADAD] border-[#D6D6D6]">
            <tr>
              {[
                { label: "Staff name", key: "employeeName" },
                { label: "Regular Hours", key: "regularHours" },
                { label: "OT Hours", key: "OThours" },
                { label: "Regular Wage", key: "regularWage" },
                { label: "OT Wage", key: "OTwage" },
                { label: "Total Wage", key: "payRate" },
                { label: "Period Start", key: "hours" },
                { label: "Period End", key: "total" },
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
                return (
                  <tr
                    key={person.id}
                    // onClick={() => onRowClick && onRowClick(person)}
                    className="text-[#565656] hover:bg-[#e4e4e4] transition-colors duration-200 p-10 cursor-pointer"
                  >
                    {/* Row data */}

                    <td className=" border-b border-[#D6D6D6] font-semibold"></td>
                    <td className=" border-b border-[#D6D6D6]  ">
                      <div className="flex gap-2 items-center justify-center"></div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      <div className="flex gap-2 items-center justify-center"></div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">
                      <div className="flex gap-2 items-center justify-center"></div>
                    </td>
                    <td className=" border-b border-[#D6D6D6]">$</td>
                    <td className=" border-b border-[#D6D6D6]"></td>
                    <td className=" border-b border-[#D6D6D6]"></td>
                    <td className=" border-b border-[#D6D6D6]"></td>
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

export default PayrollTable;
