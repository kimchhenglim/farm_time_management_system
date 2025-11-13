import React, { useState } from "react";
import PayrollTable from "../components/PayrollTable";
function Payroll() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const handleRowClick = (attendance) => {
    setSelectedAttendance(attendance);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col px-9 py-5 gap-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <span className="font-semibold text-[32px] text-[#566074]">
          Payroll
        </span>
      </div>

      {/* Payroll Table (no date props needed) */}
      <PayrollTable onRowClick={handleRowClick} />

      {/* Edit Modal */}
      {isEditModalOpen && selectedAttendance && (
        <EditAttendanceModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          data={selectedAttendance}
        />
      )}
    </div>
  );
}

export default Payroll;
