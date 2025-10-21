import { create } from "zustand";
import { axiosInstances } from "../libs/axios";
import toast from "react-hot-toast";

const useScanStore = create((set, get) => ({
  isScanning: false,
  // function to send the cardId to server
  clockIn: async (cardId, stationId) => {
    console.log(cardId, stationId);
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/in", {
        cardId: cardId,
        stationId: stationId,
      });
      if (res) {
        toast.success("Clock In Successfully!");
      }
    } catch (error) {
      if (error.response) {
        // ✅ Server responded, but not in 2xx range
        const status = error.response.status;

        if (status === 409) {
          console.log(error);
          toast.error(error.response.data.message);
        } else if (status === 400) {
          toast.error("❌ Invalid request!");
        } else if (status === 500) {
          toast.error("💥 Server error, please try again later.");
        } else {
          toast.error(`Unexpected error (${status})`);
        }
      } else if (error.request) {
        // ❌ No response received (e.g., server offline)
        toast.error("No response from server!");
      } else {
        // ❌ Something else went wrong in setup
        toast.error("Error: " + error.message);
      }

      console.error("Unexpected error in ClockOut:", error);
    } finally {
      set({ isScanning: false });
    }
  },
  clockOut: async (cardId, stationId) => {
    console.log(cardId, stationId);
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/out", {
        cardId: cardId,
        stationId: stationId,
      });
      if (res) {
        toast.success("Clock out Successfully!");
      }
    } catch (error) {
      if (error.response) {
        // ✅ Server responded, but not in 2xx range
        const status = error.response.status;

        if (status === 409) {
          toast.error(error.response.data.message);
        } else if (status === 400) {
          toast.error("❌ Invalid request!");
        } else if (status === 500) {
          toast.error("💥 Server error, please try again later.");
        } else {
          toast.error(`Unexpected error (${status})`);
        }
      } else if (error.request) {
        // ❌ No response received (e.g., server offline)
        toast.error("No response from server!");
      } else {
        // ❌ Something else went wrong in setup
        toast.error("Error: " + error.message);
      }

      console.error("Unexpected error in ClockOut:", error);
    } finally {
      set({ isScanning: false });
    }
  },
  breakIn: async (cardId, reason) => {
    // console.log(cardId, stationId);
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/break/start", {
        cardId: cardId,
        reason: reason,
      });
      if (res) {
        toast.success("Break In for " + reason + " Successfully!");
      }
    } catch (error) {
      if (error.response) {
        // ✅ Server responded, but not in 2xx range
        const status = error.response.status;

        if (status === 409) {
          toast.error(error.response.data.message);
        } else if (status === 400) {
          toast.error("❌ Invalid request!");
        } else if (status === 500) {
          toast.error("💥 Server error, please try again later.");
        } else {
          toast.error(`Unexpected error (${status})`);
        }
      } else if (error.request) {
        // ❌ No response received (e.g., server offline)
        toast.error("No response from server!");
      } else {
        // ❌ Something else went wrong in setup
        toast.error("Error: " + error.message);
      }

      console.error("Unexpected error in BreakIn:", error);
    } finally {
      set({ isScanning: false });
    }
  },
  breakOut: async (cardId, reason) => {
    // console.log(cardId, stationId);
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/break/end", {
        cardId: cardId,
      });
      if (res) {
        toast.success("Break Out Successfully!");
      }
    } catch (error) {
      if (error.response) {
        // ✅ Server responded, but not in 2xx range
        const status = error.response.status;

        if (status === 409) {
          toast.error(error.response.data.message);
        } else if (status === 400) {
          toast.error("❌ Invalid request!");
        } else if (status === 500) {
          toast.error("💥 Server error, please try again later.");
        } else {
          toast.error(`Unexpected error (${status})`);
        }
      } else if (error.request) {
        // ❌ No response received (e.g., server offline)
        toast.error("No response from server!");
      } else {
        // ❌ Something else went wrong in setup
        toast.error("Error: " + error.message);
      }

      console.error("Unexpected error in breakOut:", error);
    } finally {
      set({ isScanning: false });
    }
  },
}));

export default useScanStore;
