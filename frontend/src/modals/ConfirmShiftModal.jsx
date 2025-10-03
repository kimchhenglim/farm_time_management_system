import React, { useState } from "react";
import useRosterStore from "../stores/useRosterStore";

function ConfirmShiftModal({ isOpen, setIsOpen, rosterID }) {
  const { deleteRoster, isDeletingRoster } = useRosterStore();

  const handleDelete = async () => {
    await deleteRoster(rosterID);
    setIsOpen(false);
  };
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-700">
              Create this Shift?
            </h2>

            {/* Message */}
            <p className="text-gray-600 mt-4">
              Are you sure all information are correct?
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 ">
              <button
                className="px-6 py-2 rounded bg-gray-100 text-gray-700 font-semibold cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded bg-green-600 text-white font-semibold cursor-pointer w-[100px]"
                onClick={handleDelete}
              >
                {isDeletingRoster ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmShiftModal;
