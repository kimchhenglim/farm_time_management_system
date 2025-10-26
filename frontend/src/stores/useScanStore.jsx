import { create } from "zustand";
import { axiosInstances } from "../libs/axios";

const useScanStore = create((set) => ({
  isScanning: false,
  popupMessage: null,
  setPopupMessage: (msg) => set({ popupMessage: msg }),

  clockIn: async (card) => {
    // console.log(cardId, stationId);
    // console.log("cardId:", cardId);

    try {
      set({ isScanning: true });
      const res = await axiosInstances.post("/clocking/in", {
        cardId: card.id,
        stationId: card.station,
      });
      if (res) set({ popupMessage: "✅ Clock In Successfully!" });
    } catch (error) {
      const msg =
        "❌ " + error?.response?.data?.message || "❌ Clock In Failed!";
      set({ popupMessage: msg });
      // console.error(error);
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
      const msg =
        "❌ " + error?.response?.data?.message || "❌ Clock Out Failed!";
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
      const msg =
        "❌ " + error?.response?.data?.message || "❌ Break In Failed!";
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
      const msg =
        "❌ " + error?.response?.data?.message || "❌ Break Out Failed!";
      set({ popupMessage: msg });
    } finally {
      set({ isScanning: false });
    }
  },
}));

export default useScanStore;
