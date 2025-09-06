import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";
const useRosterStore = create((set, get) => ({
  isAddingRoster: false,
  staffActiveList: [
    {
      id: 40,
      staffName: "Chingsien Ly",
      type: "Full-time",
      payRate: "32",
    },
    {
      id: 41,
      staffName: "Masanori Isono",
      type: "Part-time",
      payRate: "32",
    },
    {
      id: 42,
      staffName: "Eri Higuchi",
      type: "Casual",
      payRate: "32",
    },
    {
      id: 43,
      staffName: "Yudou Han",
      type: "Casual",
      payRate: "32",
    },
    {
      id: 44,
      staffName: "Kimchheng Lim",
      type: "Casual",
      payRate: "32",
    },
  ],
  roster: [
    {
      date: "2025-09-01",
      day: "Monday",
      data: [
        {
          id: 1,
          staffName: "Alice",
          location: "Shed 1",
          time: "08:00 - 12:00",
          payRate: 25,
          type: "Full-time",
        },
        {
          id: 2,
          staffName: "Bob",
          location: "Shed 2",
          time: "09:00 - 13:00",
          payRate: 28,
          type: "Part-time",
        },
        {
          id: 3,
          staffName: "Charlie",
          location: "Shed 3",
          time: "10:00 - 14:00",
          payRate: 27,
          type: "Casual",
        },
        {
          id: 4,
          staffName: "Diana",
          location: "Shed 1",
          time: "12:00 - 16:00",
          payRate: 26,
          type: "Full-time",
        },
        {
          id: 5,
          staffName: "Ethan",
          location: "Shed 2",
          time: "14:00 - 18:00",
          payRate: 30,
          type: "Part-time",
        },
        {
          id: 6,
          staffName: "Chingsien",
          location: "Shed 3",
          time: "14:00 - 18:00",
          payRate: 32,
          type: "Full-time",
        },
        {
          id: 7,
          staffName: "Nancy",
          location: "Shed 1",
          time: "14:00 - 18:00",
          payRate: 29,
          type: "Casual",
        },
        {
          id: 8,
          staffName: "Mia",
          location: "Shed 2",
          time: "14:00 - 18:00",
          payRate: 24,
          type: "Part-time",
        },
        {
          id: 9,
          staffName: "Riley",
          location: "Shed 3",
          time: "14:00 - 18:00",
          payRate: 31,
          type: "Full-time",
        },
      ],
    },
    {
      date: "2025-09-02",
      day: "Tuesday",
      data: [
        {
          id: 10,
          staffName: "Fiona",
          location: "Shed 2",
          time: "08:00 - 12:00",
          payRate: 27,
          type: "Casual",
        },
        {
          id: 11,
          staffName: "George",
          location: "Shed 3",
          time: "09:00 - 13:00",
          payRate: 26,
          type: "Full-time",
        },
        {
          id: 12,
          staffName: "Hannah",
          location: "Shed 1",
          time: "10:00 - 14:00",
          payRate: 25,
          type: "Part-time",
        },
        {
          id: 13,
          staffName: "Ian",
          location: "Shed 2",
          time: "12:00 - 16:00",
          payRate: 28,
          type: "Full-time",
        },
        {
          id: 14,
          staffName: "Judy",
          location: "Shed 3",
          time: "14:00 - 18:00",
          payRate: 30,
          type: "Casual",
        },
      ],
    },
    {
      date: "2025-09-03",
      day: "Wednesday",
      data: [
        {
          id: 15,
          staffName: "Kevin",
          location: "Shed 1",
          time: "08:00 - 12:00",
          payRate: 25,
          type: "Full-time",
        },
        {
          id: 16,
          staffName: "Laura",
          location: "Shed 2",
          time: "09:00 - 13:00",
          payRate: 26,
          type: "Casual",
        },
        {
          id: 17,
          staffName: "Mike",
          location: "Shed 3",
          time: "10:00 - 14:00",
          payRate: 27,
          type: "Full-time",
        },
        {
          id: 18,
          staffName: "Nina",
          location: "Shed 1",
          time: "12:00 - 16:00",
          payRate: 24,
          type: "Part-time",
        },
        {
          id: 19,
          staffName: "Oscar",
          location: "Shed 2",
          time: "14:00 - 18:00",
          payRate: 29,
          type: "Casual",
        },
      ],
    },
    {
      date: "2025-09-04",
      day: "Thursday",
      data: [
        {
          id: 20,
          staffName: "Paul",
          location: "Shed 3",
          time: "08:00 - 12:00",
          payRate: 28,
          type: "Part-time",
        },
        {
          id: 21,
          staffName: "Quinn",
          location: "Shed 1",
          time: "09:00 - 13:00",
          payRate: 27,
          type: "Full-time",
        },
        {
          id: 22,
          staffName: "Rachel",
          location: "Shed 2",
          time: "10:00 - 14:00",
          payRate: 25,
          type: "Casual",
        },
        {
          id: 23,
          staffName: "Sam",
          location: "Shed 3",
          time: "12:00 - 16:00",
          payRate: 30,
          type: "Full-time",
        },
        {
          id: 24,
          staffName: "Tina",
          location: "Shed 1",
          time: "14:00 - 18:00",
          payRate: 26,
          type: "Casual",
        },
      ],
    },
    {
      date: "2025-09-05",
      day: "Friday",
      data: [
        {
          id: 25,
          staffName: "Uma",
          location: "Shed 2",
          time: "08:00 - 12:00",
          payRate: 27,
          type: "Full-time",
        },
        {
          id: 26,
          staffName: "Victor",
          location: "Shed 3",
          time: "09:00 - 13:00",
          payRate: 28,
          type: "Casual",
        },
        {
          id: 27,
          staffName: "Wendy",
          location: "Shed 1",
          time: "10:00 - 14:00",
          payRate: 25,
          type: "Part-time",
        },
        {
          id: 28,
          staffName: "Xavier",
          location: "Shed 2",
          time: "12:00 - 16:00",
          payRate: 29,
          type: "Full-time",
        },
        {
          id: 29,
          staffName: "Yvonne",
          location: "Shed 3",
          time: "14:00 - 18:00",
          payRate: 30,
          type: "Casual",
        },
      ],
    },
    {
      date: "2025-09-06",
      day: "Saturday",
      data: [
        {
          id: 30,
          staffName: "Zack",
          location: "Shed 1",
          time: "08:00 - 12:00",
          payRate: 26,
          type: "Casual",
        },
        {
          id: 31,
          staffName: "Amy",
          location: "Shed 2",
          time: "09:00 - 13:00",
          payRate: 25,
          type: "Full-time",
        },
        {
          id: 32,
          staffName: "Brian",
          location: "Shed 3",
          time: "10:00 - 14:00",
          payRate: 27,
          type: "Part-time",
        },
        {
          id: 33,
          staffName: "Clara",
          location: "Shed 1",
          time: "12:00 - 16:00",
          payRate: 24,
          type: "Full-time",
        },
        {
          id: 34,
          staffName: "David",
          location: "Shed 2",
          time: "14:00 - 18:00",
          payRate: 28,
          type: "Casual",
        },
      ],
    },
    {
      date: "2025-09-07",
      day: "Sunday",
      data: [
        {
          id: 35,
          staffName: "Ella",
          location: "Shed 3",
          time: "08:00 - 12:00",
          payRate: 30,
          type: "Part-time",
        },
        {
          id: 36,
          staffName: "Frank",
          location: "Shed 1",
          time: "09:00 - 13:00",
          payRate: 25,
          type: "Full-time",
        },
        {
          id: 37,
          staffName: "Grace",
          location: "Shed 2",
          time: "10:00 - 14:00",
          payRate: 26,
          type: "Casual",
        },
        {
          id: 38,
          staffName: "Henry",
          location: "Shed 3",
          time: "12:00 - 16:00",
          payRate: 29,
          type: "Part-time",
        },
        {
          id: 39,
          staffName: "Isla",
          location: "Shed 1",
          time: "14:00 - 18:00",
          payRate: 27,
          type: "Full-time",
        },
      ],
    },
  ],
  addRoster: async (
    date,
    id,
    staffName,
    location,
    startTime,
    endTime,
    type,
    payRate
  ) => {
    const { roster } = get();
    console.log(date, id, staffName, location, startTime, endTime);
    try {
      set({ isAddingRoster: true });
      const newStaff = {
        id: id,
        staffName: staffName,
        location: location,
        time: startTime + " - " + endTime,
        type: type,
        payRate: payRate,
      };
      console.log(newStaff);
      set((state) => ({
        roster: state.roster.map((day) =>
          day.date === date
            ? { ...day, data: [...day.data, newStaff] } // append new staff
            : day
        ),
      }));
      toast.success("Successfully added shift!");
      // happens in if(res)
    } catch (error) {
      console.error("Unexpected error in addRoster:", error.message);
    } finally {
      set({ isAddingRoster: false });
    }
  },
}));

export default useRosterStore;
