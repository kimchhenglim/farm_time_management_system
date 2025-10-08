import React, { useRef, useState, useEffect } from "react";
import useStationStore from "../stores/useStationStore";

function StationModal({ isOpenModal, setIsOpenModal, stationList }) {
  const modalRef = useRef(null);
  const [editId, setEditId] = useState(null);
  const [editableStations, setEditableStations] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [newStation, setNewStation] = useState({ name: "", status: "ACTIVE" });
  const [isAdding, setIsAdding] = useState(false);

  const { editStation, createStation, fetchStationList } = useStationStore();

  useEffect(() => {
    setEditableStations(stationList || []);
  }, [stationList]);

  if (!isOpenModal) return null;

  const handleChanges = (id, field, value) => {
    setEditableStations((prev) =>
      prev.map((s) => (s.stationId === id ? { ...s, [field]: value } : s))
    );
  };

  const handleEdit = async (id) => {
    const station = editableStations.find((s) => s.stationId === id);
    if (station) {
      setLoadingId(id);
      try {
        await editStation(
          station.stationId,
          station.stationName,
          station.status
        );
        setEditId(null);
        await fetchStationList(); // refresh
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleCreate = async () => {
    if (!newStation.name.trim()) return;
    setIsAdding(true);
    try {
      await createStation(newStation.name, newStation.status);
      await fetchStationList();
      setNewStation({ name: "", status: "ACTIVE" });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/40 flex items-center justify-center z-60">
      <div
        className="bg-white rounded-lg w-[350px] shadow-lg text-[#565656] z-10"
        ref={modalRef}
      >
        {/* Header */}
        <h2 className="text-xl font-semibold text-[#566074] mb-4 flex justify-between items-center px-6 pt-6">
          <span>Station</span>
          <span
            className="cursor-pointer"
            onClick={() => setIsOpenModal(false)}
          >
            X
          </span>
        </h2>

        <div className="w-full h-[1px] bg-[#ADADAD]" />

        {/* Body */}
        <div className="py-[24px] w-full px-6 flex flex-col gap-4 h-[400px] overflow-y-auto">
          {/* Existing stations */}
          {editableStations?.map((station) => {
            const isEditing = editId === station.stationId;
            const isLoading = loadingId === station.stationId;

            return (
              <div
                key={station.stationId}
                className="flex items-center justify-between gap-2"
              >
                {/* Station name */}
                {isEditing ? (
                  <input
                    type="text"
                    value={station.stationName}
                    onChange={(e) =>
                      handleChanges(
                        station.stationId,
                        "stationName",
                        e.target.value
                      )
                    }
                    className="w-[120px] border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                ) : (
                  <div
                    className="font-[500] text-[16px] w-[120px] truncate"
                    title={station.stationName}
                  >
                    {station.stationName}
                  </div>
                )}

                {/* Status */}
                {isEditing ? (
                  <select
                    value={station.status}
                    onChange={(e) =>
                      handleChanges(station.stationId, "status", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                ) : (
                  <div
                    className={`py-2 px-6 rounded-full font-medium text-sm whitespace-nowrap ${
                      station.status.toLowerCase() === "active"
                        ? "bg-[#F0FDF4] text-[#16A34A]"
                        : "bg-[#F5F5F5] text-[#8D8D8D]"
                    }`}
                  >
                    {station.status.charAt(0).toUpperCase() +
                      station.status.slice(1).toLowerCase()}
                  </div>
                )}

                {/* Action icons */}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    isLoading ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-spin text-green-600"
                      >
                        <circle
                          className="opacity-25"
                          cx="6"
                          cy="6"
                          r="5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M6 0a6 6 0 0 1 6 6H9.6a3.6 3.6 0 0 0-3.6-3.6V0z"
                        />
                      </svg>
                    ) : (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="cursor-pointer"
                          onClick={() => handleEdit(station.stationId)}
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="#16A34A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="cursor-pointer"
                          onClick={() => setEditId(null)}
                        >
                          <path
                            d="M6 6L18 18M6 18L18 6"
                            stroke="#DC2626"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </>
                    )
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer"
                      onClick={() => setEditId(station.stationId)}
                    >
                      <path
                        d="M13.7848 0.828029L12.0308 2.58173L17.4178 7.96783L19.1718 6.21412C19.7031 5.68684 20 4.96817 20 4.21826C20 3.46835 19.7031 2.74968 19.1718 2.2224L17.7772 0.828029C17.2499 0.29684 16.5311 0 15.781 0C15.031 0 14.3122 0.29684 13.7848 0.828029ZM10.7066 3.9058L2.29987 12.3072C1.88188 12.7251 1.57718 13.2485 1.41702 13.8187L0.0341331 18.8103C-0.0557153 19.1345 0.034133 19.486 0.276333 19.7243C0.518533 19.9625 0.866207 20.0563 1.19044 19.9664L6.18289 18.5799C6.75323 18.4197 7.27279 18.119 7.69468 17.6972L16.0935 9.29189L10.7066 3.9058Z"
                        fill="#566074"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}

          {/* + New station row */}
          <div className="flex items-center justify-between gap-2 text-gray-500 text-sm mt-2">
            <input
              type="text"
              placeholder="+ New station..."
              value={newStation.name}
              onChange={(e) =>
                setNewStation({ ...newStation, name: e.target.value })
              }
              className="w-[120px]  px-2 py-1 text-sm focus:outline-none "
            />
            {/* <select
              value={newStation.status}
              onChange={(e) =>
                setNewStation({ ...newStation, status: e.target.value })
              }
              className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select> */}
            <div className="p-2 bg-[#F5F5F5] rounded-sm hover:bg-[#EAEAEA] transition flex items-center justify-center w-[26px] h-[26px]">
              {isAdding ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin text-green-600"
                >
                  <circle
                    className="opacity-25"
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M6 0a6 6 0 0 1 6 6H9.6a3.6 3.6 0 0 0-3.6-3.6V0z"
                  />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer text-green-600"
                  onClick={handleCreate}
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationModal;
