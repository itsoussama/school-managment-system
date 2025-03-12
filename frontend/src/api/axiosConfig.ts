import axios from "axios";

export const axiosAuthInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
  });

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
  });