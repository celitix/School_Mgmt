import axios from "axios";
import { fetchWithAuth } from "../apiClient";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// const apiUrl = "/api";

const handleApiError = (error) => {
  if (error.response) {
    return {
      isSuccess: false,
      status: error.response.status,
      data: null,
      message:
        error.response.data?.error ||
        error.response.data?.message ||
        error.response.statusText ||
        "Something went wrong",
    };
  } else if (error.request) {
    return {
      isSuccess: false,
      status: null,
      data: null,
      message: "Server not responding. Please try again later.",
    };
  } else {
    return {
      isSuccess: false,
      status: null,
      data: null,
      message: error.message,
    };
  }
};

// Login
export const login = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/sendOtp`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      isSuccess: response.data.isSuccess,
      data: response.data.data,
      message: response.data.data?.message,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// verifyOTP
export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/verifyOtp`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      isSuccess: response.data.isSuccess,
      data: response.data.data,
      message: response.data.data?.message,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// user logout
export const userLogout = async () => {
  return await fetchWithAuth(`/user/auth/logout`, {
    method: "GET",
  });
};
