import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      document.cookie = "isAuthenticated=false; path=/; max-age=0";
      document.cookie = "userEmail=; path=/; max-age=0";
      document.cookie = "userPassword=; path=/; max-age=0";
      delete axiosInstance.defaults.headers.common["email"];
      delete axiosInstance.defaults.headers.common["password"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
