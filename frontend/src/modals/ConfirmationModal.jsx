import React from "react";
import useStaffStore from "../stores/useStaffStore";

function ConfirmModal({
  propID,
  title,
  message,
  confirmLabel,
  submitLabel,
  cancelLabel,
  handleSubmit,
  setIsOpenModal,
  style,
}) {
  const { isEditingStaff } = useStaffStore();

  const handleOnSubmit = async (e) => {
    try {
      await handleSubmit(e); // your async action will toggle isEditingStaff
      document.getElementById(propID).close();
    } catch (error) {
      console.log("Submit failed");
    }
  };

  return (
    <div>
      {submitLabel && (
        <button
          className={`${
            style
              ? style
              : "px-4 py-2 bg-[#16A34A] text-white rounded cursor-pointer"
          }`}
          onClick={() => document.getElementById(propID).showModal()}
        >
          {submitLabel}
        </button>
      )}
      <dialog id={propID} className="modal">
        <div className="modal-box bg-white">
          <p className="font-semibold text-2xl text-[#535D70] pb-6">{title}</p>
          <p className="py-4 font-medium text-base text-[#535D70]">{message}</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              className="w-full px-4 py-2 font-semibold bg-[#F5F5F5] rounded text-[#565656] cursor-pointer"
              onClick={() => document.getElementById(propID).close()}
            >
              {cancelLabel}
            </button>
            <button
              className="w-full px-4 py-2 font-semibold bg-[#16A34A] text-white rounded cursor-pointer flex items-center justify-center"
              onClick={handleOnSubmit}
              disabled={isEditingStaff}
            >
              {isEditingStaff ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ConfirmModal;
