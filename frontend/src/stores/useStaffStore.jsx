import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";

const useStaffStore = create((set, get) => ({
  staffList: [],
  isFetchingStaff: false,
  isEditingStaff: false,
  fetchStaffList: async () => {
    try {
      set({ isFetchingStaff: true });
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
    } finally {
      set({ isFetchingStaff: false });
    }
  },
  editStaffDetail: async () => {
    try {
      set({ isEditingStaff: true });
      
    } catch (error) {
      console.error("Error editing staff list:", error);
      set({ staffList: [] });
    } finally {
      set({ isEditingStaff: false });
    }
  },
}));
export default useStaffStore;
