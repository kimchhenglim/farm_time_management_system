import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";
import useAuthStore from "./useAuthStore";

const useStaffStore = create((set, get) => ({
  staffList: [],
  currentStaff: {},
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
  editStaffDetail: async (userPayload) => {
    const authUser = useAuthStore.getState().authUser;
    try {
      set({ isEditingStaff: true });
      const token = authUser?.body?.loginToken;
      const res = await axiosInstances.put(
        `/admin/users/${userPayload?.employeeId}`,
        userPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      set({ currentStaff: res?.data?.body });
      toast.success("Successfullt Updated staff detail!");
    } catch (error) {
      console.error("Error editing staff list:", error);
      // set({ staffList: [] });
    } finally {
      set({ isEditingStaff: false });
    }
  },
  fetchCurrentStaff: async (ID) => {
    try {
      set({ isFetchingStaff: true });
      console.log(ID);
      const res = await axiosInstances.get(`/users?id=${ID}`);
      if (res) {
        set({ currentStaff: res.data?.body?.content[0] });
      }
    } catch (error) {
      console.error("Error fetching current staff: ", error);
      set({ currentStaff: {} });
    } finally {
      set({ isFetchingStaff: false });
    }
  },
  editStaffStatus: async (employeeId, isActive) => {
    const authUser = useAuthStore.getState().authUser;
    try {
      set({ isEditingStaff: true });
      const token = authUser?.body?.loginToken;
      const res = await axiosInstances.put(
        `/admin/users/${employeeId}`,
        { isActive },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      set({ currentStaff: res?.data?.body });
      if (isActive) {
        toast.success("Successfullt Active staff!");
      } else {
        toast.success("Successfullt Inactive staff!");
      }
    } catch (error) {
      console.error("Error updating staff status:", error);
      // set({ staffList: [] });
    } finally {
      set({ isEditingStaff: false });
    }
  },
}));
export default useStaffStore;
