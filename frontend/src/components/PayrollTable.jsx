import React, { useEffect, useMemo, useState } from "react";
import usePayrollStore from "../stores/usePayrollStore";

function PayrollTable({ onRowClick }) {
  const {
    staffPayroll,
    getPayrollInfo,
    generatePayrollCSV,
    sendPayrollEmails,
    isGeneratingCSV,
    isSendingEmail,
    isLoadingPayroll,
  } = usePayrollStore();

  const [sortKey, setSortKey] = useState(null);
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(0); // current page
  const pageSize = 10;

  useEffect(() => {
    getPayrollInfo();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  const renderSortIcon = (key) =>
    sortKey === key ? (
      <span className="ml-1">{direction === "asc" ? "▲" : "▼"}</span>
    ) : null;

  // Sorting
  const sortedStaff = useMemo(() => {
    if (!sortKey) return staffPayroll;

    return [...staffPayroll].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      // Convert date strings to Date object
      if (typeof aValue === "string" && !isNaN(Date.parse(aValue))) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Convert numbers
      if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      return direction === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }, [staffPayroll, sortKey, direction]);

  // Pagination
  const totalPages = Math.ceil(sortedStaff.length / pageSize);
  const currentPageStaff = sortedStaff.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const totalAmount = staffPayroll.reduce(
    (sum, staff) => sum + (staff.totalWage ?? 0),
    0
  );

  const handlePrevPage = () => setPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div>
      {/* Summary + Actions */}
      <div className="w-full flex justify-between items-center mb-[24px]">
        <div className="text-[#8D8D8D] flex gap-[44px]">
          <span>{staffPayroll.length} records</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex gap-6">
          <button
            onClick={generatePayrollCSV}
            disabled={isGeneratingCSV}
            className={`px-[40px] py-[16px] border-2 rounded-md font-semibold ${
              isGeneratingCSV
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#F5F5F5] border-[#DEDEDE] text-[#566074]"
            }`}
          >
            {isGeneratingCSV ? "Sending..." : "Export"}
          </button>

          <button
            onClick={sendPayrollEmails}
            disabled={isSendingEmail}
            className={`px-[40px] py-[16px] border-2 rounded-md font-semibold ${
              isSendingEmail
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border-[#16A34A] text-[#16A34A]"
            }`}
          >
            {isSendingEmail ? "Sending..." : "Send To Staff"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[20px] overflow-hidden border border-[#D6D6D6]">
        <table className="table-auto w-full text-center">
          <thead className="text-sm text-[#ADADAD]">
            <tr>
              {[
                { label: "Staff Name", key: "employeeName" },
                { label: "Regular Hours", key: "regularHours" },
                { label: "OT Hours", key: "OThours" },
                { label: "Regular Wage", key: "regularWage" },
                { label: "OT Wage", key: "OTwage" },
                { label: "Total Wage", key: "total" },
                { label: "Period Start", key: "startDate" },
                { label: "Period End", key: "endDate" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-4 py-6 border-b border-[#D6D6D6] cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex justify-center items-center">
                    {label} {renderSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm">
            {isLoadingPayroll ? (
              <tr>
                <td colSpan="8" className="py-6 text-gray-500">
                  Loading payroll records...
                </td>
              </tr>
            ) : currentPageStaff.length > 0 ? (
              currentPageStaff.map((person, index) => (
                <tr key={index}>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    {person.employeeName}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    {person.regularHours}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    {person.otHours}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    ${person.regularWage}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    ${person.otWage}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6] font-semibold">
                    ${person.totalWage}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    {person.startDate}
                  </td>
                  <td className="py-3 border-b border-[#D6D6D6]">
                    {person.endDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-gray-500">
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
          <span className="text-sm text-gray-700 mb-2">
            Showing{" "}
            <span className="font-semibold">{page * pageSize + 1} </span> to{" "}
            <span className="font-semibold">
              {Math.min((page + 1) * pageSize, sortedStaff.length)}
            </span>{" "}
            of <span className="font-semibold">{staffPayroll.length}</span>{" "}
            entries
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
              className={`px-3 h-8 text-sm font-medium rounded-e ${
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

export default PayrollTable;
