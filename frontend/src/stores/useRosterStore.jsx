import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstances } from "../libs/axios";
const useRosterStore = create((set, get) => ({
  staffActiveList: [
    {
      id: 1,
      staffName: "Chingsien Ly",
      type: "Full-time",
      payRate: "32",
      selected: true,
    },
    {
      id: 2,
      staffName: "Masanori Isono",
      type: "Part-time",
      payRate: "32",
      selected: false,
    },
    {
      id: 3,
      staffName: "Eri Higuchi",
      type: "Casual",
      payRate: "32",
      selected: false,
    },
    {
      id: 4,
      staffName: "Yudou Han",
      type: "Casual",
      payRate: "32",
      selected: false,
    },
    {
      id: 5,
      staffName: "Kimchheng Lim",
      type: "Casual",
      payRate: "32",
      selected: false,
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
        },
        { id: 2, staffName: "Bob", location: "Shed 2", time: "09:00 - 13:00" },
        {
          id: 3,
          staffName: "Charlie",
          location: "Shed 3",
          time: "10:00 - 14:00",
        },
        {
          id: 4,
          staffName: "Diana",
          location: "Shed 1",
          time: "12:00 - 16:00",
        },
        {
          id: 5,
          staffName: "Ethan",
          location: "Shed 2",
          time: "14:00 - 18:00",
        },
        {
          id: 6,
          staffName: "Chingsien",
          location: "Shed 3",
          time: "14:00 - 18:00",
        },
        {
          id: 7,
          staffName: "Nancy",
          location: "Shed 1",
          time: "14:00 - 18:00",
        },
        { id: 8, staffName: "Mia", location: "Shed 2", time: "14:00 - 18:00" },
        {
          id: 9,
          staffName: "Riley",
          location: "Shed 3",
          time: "14:00 - 18:00",
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
        },
        {
          id: 11,
          staffName: "George",
          location: "Shed 3",
          time: "09:00 - 13:00",
        },
        {
          id: 12,
          staffName: "Hannah",
          location: "Shed 1",
          time: "10:00 - 14:00",
        },
        { id: 13, staffName: "Ian", location: "Shed 2", time: "12:00 - 16:00" },
        {
          id: 14,
          staffName: "Judy",
          location: "Shed 3",
          time: "14:00 - 18:00",
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
        },
        {
          id: 16,
          staffName: "Laura",
          location: "Shed 2",
          time: "09:00 - 13:00",
        },
        {
          id: 17,
          staffName: "Mike",
          location: "Shed 3",
          time: "10:00 - 14:00",
        },
        {
          id: 18,
          staffName: "Nina",
          location: "Shed 1",
          time: "12:00 - 16:00",
        },
        {
          id: 19,
          staffName: "Oscar",
          location: "Shed 2",
          time: "14:00 - 18:00",
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
        },
        {
          id: 21,
          staffName: "Quinn",
          location: "Shed 1",
          time: "09:00 - 13:00",
        },
        {
          id: 22,
          staffName: "Rachel",
          location: "Shed 2",
          time: "10:00 - 14:00",
        },
        { id: 23, staffName: "Sam", location: "Shed 3", time: "12:00 - 16:00" },
        {
          id: 24,
          staffName: "Tina",
          location: "Shed 1",
          time: "14:00 - 18:00",
        },
      ],
    },
    {
      date: "2025-09-05",
      day: "Friday",
      data: [
        { id: 25, staffName: "Uma", location: "Shed 2", time: "08:00 - 12:00" },
        {
          id: 26,
          staffName: "Victor",
          location: "Shed 3",
          time: "09:00 - 13:00",
        },
        {
          id: 27,
          staffName: "Wendy",
          location: "Shed 1",
          time: "10:00 - 14:00",
        },
        {
          id: 28,
          staffName: "Xavier",
          location: "Shed 2",
          time: "12:00 - 16:00",
        },
        {
          id: 29,
          staffName: "Yvonne",
          location: "Shed 3",
          time: "14:00 - 18:00",
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
        },
        { id: 31, staffName: "Amy", location: "Shed 2", time: "09:00 - 13:00" },
        {
          id: 32,
          staffName: "Brian",
          location: "Shed 3",
          time: "10:00 - 14:00",
        },
        {
          id: 33,
          staffName: "Clara",
          location: "Shed 1",
          time: "12:00 - 16:00",
        },
        {
          id: 34,
          staffName: "David",
          location: "Shed 2",
          time: "14:00 - 18:00",
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
        },
        {
          id: 36,
          staffName: "Frank",
          location: "Shed 1",
          time: "09:00 - 13:00",
        },
        {
          id: 37,
          staffName: "Grace",
          location: "Shed 2",
          time: "10:00 - 14:00",
        },
        {
          id: 38,
          staffName: "Henry",
          location: "Shed 3",
          time: "12:00 - 16:00",
        },
        {
          id: 39,
          staffName: "Isla",
          location: "Shed 1",
          time: "14:00 - 18:00",
        },
      ],
    },
  ],
}));

export default useRosterStore;
