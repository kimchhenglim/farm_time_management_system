import React, { useEffect, useRef, useState } from "react";

function StationModal({ isOpenModal, setIsOpenModal }) {
  const modalRef = useRef(null);
  if (!isOpenModal) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-60">
      <div
        className="bg-white rounded-lg p-6 w-[400px] shadow-lg text-[#565656] z-10"
        ref={modalRef}
      >
        <h2 className="text-xl font-semibold text-[#566074] mb-4">
          Edit Staff
        </h2>
      </div>
    </div>
  );
}

export default StationModal;
