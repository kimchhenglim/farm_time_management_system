import { create } from "zustand";
import { axiosInstances } from "../libs/axios";
import useAuthStore from "./useAuthStore";
import { toast } from "react-hot-toast";

const usePayrollStore = create((set) => ({
  isGeneratingCSV: false,
  isSendingEmail: false,
  isLoadingPayroll: false,

  generatePayrollCSV: async () => {
    const authUser = useAuthStore.getState().authUser;
    const token = authUser?.body?.loginToken;

    try {
      set({ isGeneratingCSV: true });
      const response = await axiosInstances.post(
        "/admin/payroll/csv",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payroll CSV email sent to admin:", response.data);
      toast.success("Successfully sent the payroll CSV email to the admin!");
    } catch (error) {
      console.error("Error generating Payroll CSV:", error);
      toast.error("Failed to send payroll CSV email to admin.");
    } finally {
      set({ isGeneratingCSV: false });
    }
  },

  sendPayrollEmails: async () => {
    const authUser = useAuthStore.getState().authUser;
    const token = authUser?.body?.loginToken;

    try {
      set({ isSendingEmail: true });
      const response = await axiosInstances.post(
        "/admin/payroll/email",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payroll emails sent successfully:", response.data);
      toast.success("Successfully sent payroll emails to all employees!");
    } catch (error) {
      console.error("Error sending payroll emails:", error);
      toast.error("Failed to send payroll emails to employees.");
    } finally {
      set({ isSendingEmail: false });
    }
  },

  getPayrollInfo: async () => {
    const authUser = useAuthStore.getState().authUser;
    const token = authUser?.body?.loginToken;

    try {
      //show loading
      set({ isLoadingPayroll: true });

      const response = await axiosInstances.get("/admin/payroll/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Payroll info fetched:", response.data);

      set({ staffPayroll: response.data.body || [] });
    } catch (error) {
      console.error("Failed to load payroll info:", error);
      toast.error("Failed to load payroll info.");
    } finally {
      set({ isLoadingPayroll: false }); //loading done
    }
  },
  staffPayroll: [],
}));

export default usePayrollStore;
