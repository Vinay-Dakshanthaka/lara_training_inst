import axios from "axios";

// Define baseURL variable
// export const baseURL = "http://localhost:8080";
export const baseURL = "http://91.108.104.65";

// Create axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
