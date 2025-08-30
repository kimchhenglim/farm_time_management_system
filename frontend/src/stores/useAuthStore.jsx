import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";

//baseURL

const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  checkAuth: async () => {
    try {
      if (sessionStorage.getItem("authUser")) {
        // const res = await axiosInstances.get("/login");
        set({ authUser: sessionStorage.getItem("authUser") }); //set the state
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // ✅ Handle 404 silently without logging it as an error
        set({ authUser: null });
      } else {
        console.error("Unexpected error in checkAuth:", error.message); // ✅ Log only unexpected errors
      }
    } finally {
      set({ isCheckingAuth: false }); //set the state
    }
  },
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstances.post("/login", data);
      if (res) {
        set({ authUser: res.data });
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
}));
export default useAuthStore;
