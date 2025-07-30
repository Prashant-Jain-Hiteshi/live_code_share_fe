import {
  LoginFormData,
  OtpFormData,
  SignupFormData,
} from "@/utils/common/Interface/ApiTypes";
import axios, { AxiosError } from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,

  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

export const signupApi = async (formData: SignupFormData) => {
  try {
    const response = await api.post("/auth/register", formData);

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    if (err.response) {
      console.error("Error response:", err.response.data?.message);
      throw new Error(
        err.response.data.message || "An error occurred during signup."
      );
    } else if (err.request) {
      console.error("Error request:", err.request);
      throw new Error("No response from the server. Please try again later.");
    } else {
      console.error("Error message:", err.message);
      throw new Error("An error occurred. Please try again.");
    }
  }
};
export const verifyOtp = async (formData: OtpFormData) => {
  try {
    const response = await api.post("/auth/verify-otp", formData);
    console.log(response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
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
export const LoginApi = async (formData: LoginFormData) => {
  try {
    const response = await api.post("/auth/login", formData);
    console.log(response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
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

export const createFileApi = async (title: string) => {
  try {
    const response = await api.post("/files", { title, content: "" });
    console.log(response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      console.error("API Error:", error.response.data?.message);
      throw new Error(error.response.data?.message || "Failed to create file.");
    } else if (error.request) {
      console.error("Request Error:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Something went wrong.");
    }
  }
};
export const getMyFiles = async () => {
  try {
    const response = await api.get("/files/my");
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      console.error("API Error:", error.response.data?.message);
      throw new Error(error.response.data?.message || "Failed to fetch files.");
    } else if (error.request) {
      console.error("Request Error:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Something went wrong.");
    }
  }
};
export const getFileById = async (
  fileId: string
): Promise<{ content: string; title: string }> => {
  try {
    const response = await api.get(`/files/single/${fileId}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      console.error("API Error:", error.response.data?.message);
      throw new Error(error.response.data?.message || "Failed to fetch file.");
    } else if (error.request) {
      console.error("Request Error:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Something went wrong.");
    }
  }
};
export const updateFileContent = async (fileId: string, content: string) => {
  try {
    const response = await api.put(`/files/${fileId}`, { content });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      console.error("API Error:", error.response.data?.message);
      throw new Error(error.response.data?.message || "Failed to update file.");
    } else if (error.request) {
      console.error("Request Error:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Something went wrong.");
    }
  }
};
export const shareFileByEmail = async (email: string, fileLink: string) => {
  try {
    const response = await api.post("/invitation/share", { email, fileLink });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      console.error("API Error:", error.response.data?.message);
      throw new Error(
        error.response.data?.message || "Failed to share file by email."
      );
    } else if (error.request) {
      console.error("Request Error:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Something went wrong.");
    }
  }
};

export const myPendingInvites = async () => {
  try {
    const response = await api.get("/invitation/my/pending");
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response) {
      console.error("API Error:", error.response.data?.message);
      throw new Error(
        error.response.data?.message || "Failed to fetch Invitations."
      );
    } else if (error.request) {
      console.error("Request Error:", error.request);
      throw new Error("No response from server.");
    } else {
      console.error("Error:", error.message);
      throw new Error("Something went wrong.");
    }
  }
};
