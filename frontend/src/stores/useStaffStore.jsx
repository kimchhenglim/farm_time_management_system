import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";
import useAuthStore from "./useAuthStore";

const useStaffStore = create((set, get) => ({
  staffList: [],
  currentStaff: {},

  isFetchingStaff: false,
  isEditingStaff: false,
  fetchStaffList: async (pageNum = 0, size = 10, filters = {}) => {
    try {
      set({ isFetchingStaff: true });
      const response = await axiosInstances.get("/users", {
        params: { page: pageNum, size, sortDir: "Desc", ...filters },
      });
      const body = response.data?.body;
      const data =
        body?.content && Array.isArray(body.content) ? body.content : [];
      set({
        staffList: data,
        page: body?.number ?? 0,
        totalPages: body?.totalPages ?? 0,
        totalElements: body?.totalElements ?? 0,
        numberOfElements: body?.numberOfElements ?? 0,
      });
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
      const updatedStaff = res?.data?.body;

      set((state) => ({
        staffList: state.staffList.map((s) =>
          s.id === employeeId ? updatedStaff : s
        ),
        currentStaff: updatedStaff,
      }));
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

  activeStaffList: [],
  activeStaffPage: 0,
  activeStaffLastPage: false,
  isFetchingActiveStaff: false,

  fetchActiveStaffPaginated: async (
    pageSize = 10,
    page = null,
    reset = false
  ) => {
    let { activeStaffPage, activeStaffList } = get();

    if (reset) {
      activeStaffPage = 0; // reset to first page
      activeStaffList = []; // clear old list
      set({ totalPages: 1 }); // reset totalPages to ensure fetch runs
    }

    if (page !== null) activeStaffPage = page;

    if (activeStaffPage >= get().totalPages) return;

    set({ isFetchingActiveStaff: true });

    try {
      const res = await axiosInstances.get("/users", {
        params: {
          page: activeStaffPage,
          size: pageSize,
          sortDir: "Desc",
          isActive: true,
        },
      });

      const body = res.data?.body;
      const newStaff = body?.content || [];

      set({
        activeStaffList:
          activeStaffPage === 0 ? newStaff : [...activeStaffList, ...newStaff],
        activeStaffPage: body?.number + 1,
        totalPages: body?.totalPages,
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isFetchingActiveStaff: false });
    }
  },

  searchActiveStaff: async (query, pageSize = 10) => {
    if (!query) {
      // Force reset when search is empty
      get().fetchActiveStaffPaginated(pageSize, 0, true);
      return;
    }

    set({ isFetchingActiveStaff: true });

    try {
      const isIdSearch = /^\d+$/.test(query);
      const params = {
        page: 0,
        size: pageSize,
        sortDir: "Desc",
        isActive: true,
      };

      if (isIdSearch) params.id = query;
      else params.name = query;

      const res = await axiosInstances.get("/users", { params });
      const body = res.data?.body;
      const newStaff = body?.content || [];

      set({
        activeStaffList: newStaff,
        activeStaffPage: 1,
        totalPages: body?.totalPages,
      });
    } catch (err) {
      console.error("Error searching staff:", err);
      set({ activeStaffList: [] });
    } finally {
      set({ isFetchingActiveStaff: false });
    }
  },
}));
export default useStaffStore;
