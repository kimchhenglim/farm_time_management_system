import React from "react";

function ConfirmEditModal({
  propID,
  title,
  message,
  confirmLable,
  cancelLable,
}) {
  return (
    <div>
      <input type="checkbox" id={propID} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <label htmlFor={propID}>✕</label>
            </button>
          </div>
          <p className="py-4">{message}</p>
          <div>
            <button>{confirmLable}</button>
            <button>{cancelLable}</button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor={propID}>
          Close
        </label>
      </div>
    </div>
  );
}

export default ConfirmEditModal;
