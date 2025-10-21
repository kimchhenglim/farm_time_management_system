import React, { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import Clock from "../components/Clock";
import { Link } from "react-router-dom";
import useStationStore from "../stores/useStationStore";

function ManualClockIn() {
  // ✅ station store
  const { fetchStationList, stationList, stationLoading } = useStationStore();
  // clear useAuthStore
  const { authUser, setAuthUser } = useAuthStore();
  useEffect(() => {
    if (authUser) {
      setAuthUser();
    }
    fetchStationList();
  }, []);

  const [formData, setFormData] = useState({
    station: "",
    cardId: "",
  });
  //handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Filter only ACTIVE stations
  const activeStations =
    stationList?.filter((s) => (s.status || "").toUpperCase() === "ACTIVE") ||
    [];
  return (
    <div className="w-full h-full p-10 flex flex-col gap-6">
      {/* clock */}
      <div className="flex items-center justify-between">
        <div className="w-[250px] h-[60px] ">
          <Clock />
        </div>
      </div>
      {/* loading page */}
      <div className="w-full h-full  flex flex-col items-center justify-center gap-10">
        <form className="flex gap-[111px] flex-col">
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
          {/* cardID */}
          <div className="flex items-center gap-6">
            <label
              htmlFor="cardId"
              className="text-4xl font-semibold text-[#565656] w-[150px]"
            >
              Card ID
            </label>
            <input
              type="text"
              placeholder="Type ID Card"
              className="w-[500px] h-[50px] border border-[#ADADAD] px-3 py-2 rounded bg-white focus:outline-green-500"
            />
          </div>
          {/* buttons */}
          <div className="w-full h-full flex justify-end gap-10">
            <Link to="/staff/clockIn">
              <button className=" px-10 rounded-sm py-4 bg-[#F5F5F5] text-2xl text-[#565656] font-semibold cursor-pointer">
                Back
              </button>
            </Link>
            <button className=" px-10 rounded-sm py-4 bg-[#16A34A] text-2xl text-white cursor-pointer">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualClockIn;
