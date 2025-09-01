import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";

const useStaffStore = create((set, get) => ({
  staffList: [],
  fetchStaffList: async () => {
    try {
      const response = await axiosInstances.get("/users");
      const data =
        response.data?.body?.content &&
        Array.isArray(response.data.body.content)
          ? response.data.body.content
          : [];
      set({ staffList: data });
    } catch (error) {
      console.error("Error fetching staff list:", error);
      set({ staffList: [] });
    }
  },
}));
export default useStaffStore;
