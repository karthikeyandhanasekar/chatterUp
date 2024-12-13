import axios from "axios";
export const apiBaseUrl = "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    /**
     * Content-Type header set to application/json.
     */
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Return the modified request config
    return config;
  },
  (error) => {
    if (!(error instanceof Error)) {
      error = new Error(
        typeof error === "string" ? error : "An unknown error occurred"
      );
    }
    // Handle request error by passing the Error object
    return Promise.reject(error); // Rejection is now always an instance of Error
  }
);

export default axiosInstance;
