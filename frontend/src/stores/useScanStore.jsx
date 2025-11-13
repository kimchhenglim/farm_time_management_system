import { create } from "zustand";
import { axiosInstances } from "../libs/axios";

const handleError = (error, defaultMsg) => {
  let msg = error?.response?.data?.message || defaultMsg;

  // Custom mapping
  if (msg?.toLowerCase().includes("user not found")) {
    msg =
      "❌ Card is not registered. Please contact the Main Office for more details.";
  } else {
    msg = "❌ " + msg;
  }

  return msg;
};

const useScanStore = create((set) => ({
  isScanning: false,
  popupMessage: null,
  setPopupMessage: (msg) => set({ popupMessage: msg }),

  clockIn: async (card) => {
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/in", {
        cardId: card.id,
        stationId: card.station,
      });
      if (res) set({ popupMessage: "✅ Clock In Successfully!" });
    } catch (error) {
      const msg = handleError(error, "Clock In Failed!");
      set({ popupMessage: msg });
    } finally {
      set({ isScanning: false });
    }
  },

  clockOut: async (card) => {
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/out", {
        cardId: card.id,
        stationId: card.station,
      });
      if (res) set({ popupMessage: "✅ Clock Out Successfully!" });
    } catch (error) {
      const msg = handleError(error, "Clock Out Failed!");
      set({ popupMessage: msg });
    } finally {
      set({ isScanning: false });
    }
  },

  breakIn: async (card, reason) => {
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/break/start", {
        cardId: card.id,
        reason,
      });
      if (res) set({ popupMessage: `☕ Break In (${reason}) Successfully!` });
    } catch (error) {
      const msg = handleError(error, "Break In Failed!");
      set({ popupMessage: msg });
    } finally {
      set({ isScanning: false });
    }
  },

  breakOut: async (card) => {
    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/break/end", {
        cardId: card.id,
      });
      if (res) set({ popupMessage: "✅ Break Out Successfully!" });
    } catch (error) {
      const msg = handleError(error, "Break Out Failed!");
      set({ popupMessage: msg });
    } finally {
      set({ isScanning: false });
    }
  },
}));

export default useScanStore;
