import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";

//baseURL

const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: false,
  isLoggingIn: false,
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const storedUser = sessionStorage.getItem("authUser");
      if (storedUser) {
        set({ authUser: JSON.parse(storedUser) }); // 🔑 FIX: parse it
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      console.error("Unexpected error in checkAuth:", error.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstances.post("/login", data);
      if (res) {
        set({ authUser: res.data });
        console.log(res.data);
        toast.success("successfully Login!");
        //add chat-user into sessionStorage when browser close the session get delete
        sessionStorage.setItem("authUser", JSON.stringify(res.data));
      }
    } catch (error) {
      console.log("Login ", error);
      toast.error("Account email or Password is incorrect!");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async (email, token) => {
    // console.log(email, token);
    try {
      const res = await axiosInstances.post(
        "/logout",
        { email }, // request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      if (res) {
        sessionStorage.clear();
        toast.success("Successfully logout!");
        set({ authUser: null });
      }
    } catch (error) {
      console.log("Logout ", error);
      toast.error("Logout error!");
    }
  },
}));
export default useAuthStore;
