function ConfirmationModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-60"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-[#374151] mb-4">{title}</h2>
        <p className="text-[#6B7280] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            className="w-full bg-[#D1D5DB] text-[#374151] px-4 py-2 rounded hover:bg-[#E5E7EB]"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            className="w-full bg-[#16A34A] text-white px-4 py-2 rounded hover:bg-[#15803D]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
