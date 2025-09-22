import { createContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext({});

// use this to provide auth state and methods to the rest of the app (on every refresh)
export default function AuthProvider({ children }) {
  // hook
  const { getToken } = useAuth();

  useEffect(() => {
    // setup axios interceptor

    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          // send token in Authorization header to backend
          if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          if (
            error.message?.includes("auth") ||
            error.message?.includes("token")
          ) {
            toast.error("Authentication failed. Please refresh the page.");
          }
          console.log("Error getting token:", error);
        }
        return config;
      },
      (error) => {
        console.log("Axios request error:", error);
        return Promise.reject(error);
      }
    );
    // Cleanup interceptor on unmount, avoid memory leaks
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
