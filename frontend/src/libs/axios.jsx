import axios from "axios";
export const axiosInstances = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  withCredentials: true,
});
