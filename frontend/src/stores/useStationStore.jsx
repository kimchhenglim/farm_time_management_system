import { create } from "zustand";
import { axiosInstances } from "../libs/axios";
import useAuthStore from "./useAuthStore";

const useStationStore = create((set, get) => ({
  stationList: [],
  stationLoading: false,
  createLoading: false,
  fetchStationList: async () => {
    const authUser = useAuthStore.getState().authUser;
    try {
      const token = authUser?.body?.loginToken;
      set({ stationLoading: true });
      const res = await axiosInstances.get("admin/station/get", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      set({ stationList: res?.data?.body?.stationList });
    } catch (error) {
      console.error("Error fetching staff list:", error);
      set({ stationList: [] });
    } finally {
      set({ stationLoading: false });
    }
  },
  createStation: async (name, status = "ACTIVE") => {
    const authUser = useAuthStore.getState().authUser;
    try {
      const token = authUser?.body?.loginToken;
      set({ createLoading: true });
      const res = await axiosInstances.post(
        "admin/station/create",
        {
          name: name,
          location: "This is address",
          status: status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error creating station:", error);
    } finally {
      set({ createLoading: false });
    }
  },
  editStation: async (stationId, stationName, status) => {
    console.log("Editing station:", stationId, stationName, status);
    const authUser = useAuthStore.getState().authUser;

    try {
      const token = authUser?.body?.loginToken;

      const res = await axiosInstances.put(
        "admin/station/update",
        {
          stationId: stationId,
          stationName: stationName,
          stationLocation: "This is new address",
          status: status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.body);
      // ✅ Update the local store immediately
      const updatedStation = res?.data?.body;
      console.log(updatedStation);

      if (updatedStation) {
        set((state) => ({
          stationList: state.stationList.map((s) =>
            s.stationId === updatedStation.stationId ? updatedStation : s
          ),
        }));
      }

      console.log("Station updated:", updatedStation);
    } catch (error) {
      console.error("Error updating station:", error);
    }
  },
}));

export default useStationStore;
