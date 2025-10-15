import { create } from "zustand";
import { axiosInstances } from "../libs/axios";
import useAuthStore from "./useAuthStore";

const useAttendanceStore = create((set, get) => ({
  staffTable: [],
  isFetchingStaffTable: false,
  fetchStaffTable: async (
    weekStart,
    weekEnd,
    pageNum = 0,
    size = 10,
    filters = {}
  ) => {
    const authUser = useAuthStore.getState().authUser;
    // const weekStartDate = ;
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);
    // Get Australia date parts
    let auDateStart = weekStartDate
      .toLocaleDateString("en-AU")
      .replace(/\//g, "-"); // Replace "/" with "-"
    let auDateEnd = weekEndDate.toLocaleDateString("en-AU").replace(/\//g, "-");
    console.log(auDateStart);
    console.log(auDateEnd);

    try {
      set({ isFetchingStaffTable: true });
      const token = authUser?.body?.loginToken;
      const res = await axiosInstances.get(
        `/admin/clockings?startDate=${auDateStart}&endDate=${auDateEnd}`,
        {
          params: { page: pageNum, size, sortDir: "Desc", ...filters },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const body = res.data?.body;
      const data =
        body?.content && Array.isArray(body.content) ? body.content : [];
      set({
        staffTable: data,
        page: body?.number ?? 0,
        totalPages: body?.totalPages ?? 0,
        totalElements: body?.totalElements ?? 0,
        numberOfElements: body?.numberOfElements ?? 0,
      });
    } catch (error) {
      console.error("Error fetching staff table:", error);
      set({ staffTable: [] });
    } finally {
      set({ isFetchingStaffTable: false });
    }
  },

  createAttendance: async (attendanceData) => {
    const authUser = useAuthStore.getState().authUser;
    try {
      const token = authUser?.body?.loginToken;
      const res = await axiosInstances.post("admin/clocking", attendanceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res; // success
    } catch (error) {
      console.error("Error creating attendance:", error);
      throw error;
    }
  },
  updateAttendance: async (clockingId, attendanceData) => {
    const authUser = useAuthStore.getState().authUser;
    try {
      const token = authUser?.body?.loginToken;
      const res = await axiosInstances.put(
        `/admin/clocking/${clockingId}`,
        attendanceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res;
    } catch (error) {
      console.error("Error updating attendance:", error);
      return null;
    }
  },

  deleteAttendance: async (clockingId) => {
    const authUser = useAuthStore.getState().authUser;
    if (!clockingId) return null;

    try {
      const token = authUser?.body?.loginToken;
      const res = await axiosInstances.delete(`/admin/clocking/${clockingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      return null;
    }
  },
}));

export default useAttendanceStore;
