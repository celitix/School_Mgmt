import axios from "axios";
import { fetchWithAuth } from "../apiClient";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
// const apiUrl = "/api";

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status code
    return {
      success: false,
      status: error.response.status,
      message:
        error.response.data?.message ||
        error.response.statusText ||
        "Something went wrong",
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      status: null,
      message: "Server not responding. Please try again later.",
    };
  } else {
    // Something else happened
    return {
      success: false,
      status: null,
      message: error.message,
    };
  }
};

// Login
export const login = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/user/auth/login`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// verifyOTP
export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/user/auth/verifyotp`, data, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      data: response.data,
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
