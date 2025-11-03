import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";
import useAuthStore from "./useAuthStore";
import { startOfWeek, format } from "date-fns";

const useRosterStore = create((set, get) => ({
  isAddingRoster: false,
  isEditingRoster: false,
  isDeletingRoster: false,
  staffActiveList: [],
  roster: [],

  fetchRoster: async (weekStart, stations = []) => {
    const authUser = useAuthStore.getState().authUser;
    console.log(stations);
    try {
      const token = authUser?.body?.loginToken;
      const params = { weekStart };
      if (stations.length) params.stations = stations.join(",");
      const res = await axiosInstances.get("/admin/roster/get", {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const rosterList = res.data?.body?.rosterList || [];
      // console.log("Fetched roster:", rosterList);

      const grouped = rosterList.reduce((acc, item) => {
        const [datePart] = item.startTime.split(" "); // "11-09-2025"
        const [day, month, year] = datePart.split("-").map(Number);
        const isoDate = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`; // "2025-09-11"

        if (!acc[isoDate]) {
          acc[isoDate] = { date: isoDate, data: [] };
        }

        const parseDateTime = (str) => {
          if (!str) return null;
          const [datePart, timePart] = str.split(" ");
          const [day, month, year] = datePart.split("-").map(Number);
          const [hour, minute] = timePart.split(":").map(Number);
          return new Date(year, month - 1, day, hour, minute);
        };

        const startDate = parseDateTime(item.startTime);
        const endDate = parseDateTime(item.endTime);

        const formatTo12Hour = (d) => {
          if (!d) return "Invalid Time";
          let hour = d.getHours();
          const minute = d.getMinutes();
          const ampm = hour >= 12 ? "PM" : "AM";
          hour = hour % 12 || 12;
          return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
        };

        acc[isoDate].data.push({
          id: item.rosterId,
          employeeName: item.employeeName || item.staffName,
          employeeId: item.employeeId,
          station: item.station,
          time: `${formatTo12Hour(startDate)} - ${formatTo12Hour(endDate)}`,
          type: item.type,
          payRate: item.payRate,
          totalHour: item.totalHour,
        });

        return acc;
      }, {});

      const newRoster = Object.values(grouped);
      set({ roster: newRoster });
    } catch (err) {
      console.error("Error fetching roster:", err);
    }
  },

  addRoster: async ({
    date,
    staffId,
    staffName,
    station,
    startTime,
    endTime,
    type,
    payRate,
    totalHour,
    breakMinutes = null,
  }) => {
    try {
      set({ isAddingRoster: true });
      const authUser = useAuthStore.getState().authUser;
      const token = authUser?.body?.loginToken;

      const { data } = await axiosInstances.post(
        "/admin/roster/create",
        {
          employeeId: staffId,
          employeeName: staffName,
          station,
          startTime,
          endTime,
          breakMinutes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatTo12Hour = (dateTimeStr) => {
        if (!dateTimeStr) return "?";

        // Handle format like "22-09-2025 15:29"
        let dateObj;
        if (dateTimeStr.includes("-")) {
          // "dd-MM-yyyy HH:mm"
          const [datePart, timePart] = dateTimeStr.split(" ");
          if (!timePart) return "?";
          const [day, month, year] = datePart.split("-").map(Number);
          const [hour, minute] = timePart.split(":").map(Number);
          dateObj = new Date(year, month - 1, day, hour, minute);
        } else {
          dateObj = new Date(dateTimeStr);
        }

        if (isNaN(dateObj)) return "?";

        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        return `${hour12}:${minutes.toString().padStart(2, "0")}${ampm}`;
      };

      // Update local store
      const newShift = {
        id: data?.id,
        employeeName: staffName,
        station,
        time: `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`,
        type,
        payRate,
      };

      // set((state) => {
      //   const rosterExists = state.roster.some((day) => day.date === date);

      //   const updatedRoster = rosterExists
      //     ? state.roster.map((day) =>
      //         day.date === date
      //           ? { ...day, data: [...day.data, newShift] }
      //           : day
      //       )
      //     : [...state.roster, { date, data: [newShift] }];

      //   return { roster: updatedRoster };
      // });
      const start = format(
        startOfWeek(new Date(date), { weekStartsOn: 1 }),
        "yyyy-MM-dd"
      );
      await get().fetchRoster(start);
      toast.success("Shift created successfully!");

      // const weekStart
      return data;
    } catch (err) {
      console.error("Failed to add shift:", err);
      toast.error(
        err.response?.data?.body ||
          err.response?.data?.message ||
          "Failed to create shift"
      );
      throw err;
    } finally {
      set({ isAddingRoster: false });
    }
  },
  editRoster: async ({
    rosterId,
    date,
    employeeId,
    staffName,
    station,
    startTime,
    endTime,
    type,
    payRate,
    totalHour,
  }) => {
    try {
      console.log("update employee id:", employeeId);
      set({ isEditingRoster: true });
      const authUser = useAuthStore.getState().authUser;
      const token = authUser?.body?.loginToken;
      const { data } = await axiosInstances.put(
        "/admin/roster/update",
        {
          rosterId,
          employeeId,
          station,
          startTime,
          endTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatTo12Hour = (dateTimeStr) => {
        if (!dateTimeStr) return "?";
        const [datePart, timePart] = dateTimeStr.split(" ");
        const [day, month, year] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        const dateObj = new Date(year, month - 1, day, hour, minute);
        if (isNaN(dateObj)) return "?";
        const h = dateObj.getHours();
        const m = dateObj.getMinutes();
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        return `${hour12}:${m.toString().padStart(2, "0")}${ampm}`;
      };

      const [startDatePart] = startTime.split(" "); // "dd-MM-yyyy"
      const [day, month, year] = startDatePart.split("-").map(Number);
      const newDate = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      const updatedShift = {
        id: rosterId,
        employeeName: staffName,
        station,
        time: `${formatTo12Hour(startTime)} - ${formatTo12Hour(endTime)}`,
        type,
        payRate,
        totalHour,
      };

      set((state) => {
        const filteredRoster = state.roster
          .map((day) => ({
            ...day,
            data: day.data.filter((shift) => shift.id !== rosterId),
          }))
          .filter((day) => day.data.length > 0);

        const rosterExists = filteredRoster.some((day) => day.date === newDate);
        const updatedRoster = rosterExists
          ? filteredRoster.map((day) =>
              day.date === newDate
                ? { ...day, data: [...day.data, updatedShift] }
                : day
            )
          : [...filteredRoster, { date: newDate, data: [updatedShift] }];

        return { roster: updatedRoster };
      });

      toast.success("Shift updated successfully!");
      return data;
    } catch (err) {
      console.error("Failed to edit shift:", err);
      toast.error(err.response?.data?.body || "Failed to update shift");
      throw err;
    } finally {
      set({ isEditingRoster: false });
    }
  },

  deleteRoster: async (rosterId) => {
    try {
      set({ isDeletingRoster: true });

      const authUser = useAuthStore.getState().authUser;
      const token = authUser?.body?.loginToken;

      await axiosInstances.delete("/admin/roster/delete", {
        params: {
          hard: "false",
          rosterId: rosterId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local store
      set((currentState) => ({
        roster: currentState.roster.map((day) => ({
          ...day,
          data: day.data.filter((shift) => shift.id !== rosterId),
        })),
      }));
      toast.success("Shift deleted successfully!");
    } catch (error) {
      console.error("Error deleting roster:", error.message);
    } finally {
      set({ isDeletingRoster: false });
    }
  },
}));

export default useRosterStore;
