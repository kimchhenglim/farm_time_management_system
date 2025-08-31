function NewConfirmationModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  handleSubmit,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="font-semibold text-2xl text-[#535D70] pb-6">{title}</h2>
        <p className="py-4 font-medium text-base text-[#535D70]">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
            onClick={handleSubmit}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewConfirmationModal;
