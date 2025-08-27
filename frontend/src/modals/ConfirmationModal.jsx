import React from "react";

function ConfirmModal({
  propID,
  title,
  message,
  confirmLabel,
  submitLabel,
  cancelLabel,
  handleSubmit,
  setIsOpenModel,
}) {
  const handleOnSubmit = (e) => {
    handleSubmit(e);
    setIsOpenModel(false);
    document.getElementById(propID).close();
  };
  return (
    <div>
      <button
        className="px-4 py-2 bg-[#16A34A] text-white rounded cursor-pointer"
        onClick={() => document.getElementById(propID).showModal()}
      >
        {submitLabel}
      </button>
      <dialog id={propID} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{message}</p>
          <button onClick={handleOnSubmit}>{confirmLabel}</button>
          <button onClick={() => document.getElementById(propID).close()}>
            {cancelLabel}
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default ConfirmModal;
