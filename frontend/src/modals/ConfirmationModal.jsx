import React from "react";

function ConfirmModal({
  propID,
  title,
  message,
  confirmLabel,
  submitLabel,
  cancelLabel,
  handleSubmit,
  setIsOpenModal,
}) {
  const handleOnSubmit = (e) => {
    handleSubmit(e);
    setIsOpenModal(false);
    document.getElementById(propID).close();
  };
  return (
    <div>
      {submitLabel && (
        <button
          className="px-4 py-2 bg-[#16A34A] text-white rounded cursor-pointer"
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
              className="w-full px-4 py-2 font-semibold bg-[#16A34A] text-white rounded cursor-pointer"
              onClick={handleOnSubmit}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ConfirmModal;
