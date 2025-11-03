import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import Clock from "../components/Clock";
import { Link, useNavigate, useParams } from "react-router-dom";
import useStationStore from "../stores/useStationStore";
import useScanStore from "../stores/useScanStore";

function ManualClockIn() {
  const navigate = useNavigate();
  const { type, reason } = useParams();

  const { stationList, stationLoading } = useStationStore();
  const {
    clockIn,
    clockOut,
    breakIn,
    breakOut,
    isScanning,
    popupMessage,
    setPopupMessage,
  } = useScanStore();

  const { authUser, setAuthUser } = useAuthStore();

  useEffect(() => {
    if (authUser) setAuthUser();
  }, []);

  const [formData, setFormData] = useState({
    station: "",
    cardId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const activeStations =
    stationList?.filter((s) => (s.status || "").toUpperCase() === "ACTIVE") ||
    [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "clockIn") {
        await clockIn({ id: formData.cardId, station: "1" });
      } else if (type === "clockOut") {
        await clockOut({ id: formData.cardId, station: "1" });
      } else if (type === "breakIn") {
        await breakIn({ id: formData.cardId, station: "1" }, reason);
      } else if (type === "breakOut") {
        await breakOut({ id: formData.cardId, station: "1" });
      }

      // wait for popup to show
      setTimeout(() => {
        setPopupMessage(null);
        navigate("/staff");
      }, 2000); // ⏱️ 2 seconds
    } catch (err) {
      console.error("Error while clocking:", err);
      setPopupMessage("❌ Something went wrong!");
      setTimeout(() => {
        setPopupMessage(null);
        navigate("/staff");
      }, 2000);
    }
  };

  return (
    <div className="w-full h-full p-10 flex flex-col gap-6 relative">
      {/* clock header */}
      <div className="flex items-center justify-between">
        <div className="w-[250px] h-[60px]">
          <Clock />
        </div>
      </div>

      {/* form */}
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        <form className="flex gap-[111px] flex-col" onSubmit={handleSubmit}>
          {/* Station */}
          <div className="flex items-center gap-6">
            <label
              htmlFor="station"
              className="text-4xl font-semibold text-[#565656] w-[150px]"
            >
              Station
            </label>
            <select
              name="station"
              id="station"
              value={formData.station}
              onChange={handleChange}
              disabled={stationLoading}
              className="w-[500px] h-[50px] border border-[#ADADAD] px-3 py-2 rounded bg-white focus:outline-green-500"
            >
              {stationLoading ? (
                <option>Loading stations...</option>
              ) : activeStations.length > 0 ? (
                <>
                  <option value="">Select Station</option>
                  {activeStations.map((st) => (
                    <option
                      key={st.stationId || st.id}
                      value={st.name || st.stationName}
                    >
                      {st.name || st.stationName}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No active stations</option>
              )}
            </select>
          </div>

          {/* Card ID */}
          <div className="flex items-center gap-6">
            <label
              htmlFor="cardId"
              className="text-4xl font-semibold text-[#565656] w-[150px]"
            >
              Card ID
            </label>
            <input
              type="text"
              name="cardId"
              value={formData.cardId}
              placeholder="Type ID Card"
              onChange={handleChange}
              className="w-[500px] h-[50px] border border-[#ADADAD] px-3 py-2 rounded bg-white focus:outline-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="w-full h-full flex justify-end gap-10">
            <Link to="/staff">
              <button
                type="button"
                className="px-10 rounded-sm py-4 bg-[#F5F5F5] text-2xl text-[#565656] font-semibold cursor-pointer"
              >
                Back
              </button>
            </Link>
            <button
              type="submit"
              className="px-10 rounded-sm py-4 bg-[#16A34A] text-2xl text-white cursor-pointer"
            >
              {isScanning ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Auto Popup Modal */}
      {popupMessage && (
        <div className="fixed inset-0 bg-[#000000]/40 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-10 text-center w-1/2 max-w-[600px]">
            <h2 className="text-3xl font-bold text-[#16A34A] mb-6">Message</h2>
            <p className="text-2xl text-gray-700">{popupMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManualClockIn;
