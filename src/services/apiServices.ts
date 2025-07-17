import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export const signupApi = async (formData: any) => {
  try {
    const response = await api.post("/auth/register", formData);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data?.message);
      throw new Error(
        error.response.data.message || "An error occurred during signup."
      );
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response from the server. Please try again later.");
    } else {
      console.error("Error message:", error.message);
      throw new Error("An error occurred. Please try again.");
    }
  }
};
export const verifyOtp = async (formData: any) => {
  try {
    const response = await api.post("/auth/verify-otp", formData);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error response:", error.response.data?.message);
      throw new Error(
        error.response.data.message || "An error occurred during signup."
      );
    } else if (error.request) {
      console.error("Error request:", error.request);
      throw new Error("No response from the server. Please try again later.");
    } else {
      console.error("Error message:", error.message);
      throw new Error("An error occurred. Please try again.");
    }
  }
};

