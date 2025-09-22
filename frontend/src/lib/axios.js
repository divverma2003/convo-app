// Send token with every request for the backend
// Frontend knows with browserprotector
// https://convo-app-backend-beta.vercel.app/

import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "https://convo-app-backend-beta.vercel.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies and tokens with every request
});
