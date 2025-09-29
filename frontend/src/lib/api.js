import { axiosInstance } from "./axios.js";

export async function getStreamToken() {
  try {
    const response = await axiosInstance.get("/chat/token");
    // const token = response.data?.data;
    // console.log("Stream token response:", response.data?.data);

    return response.data?.data; // return the entire data object
  } catch (error) {
    console.error("Error fetching Stream token:", error);
  }
}
