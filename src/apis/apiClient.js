import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return {
      isSuccess: false,
      status: 401,
      data: null,
      message: "Unauthorized. Please login again.",
    };
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const instance = axios.create({
    timeout: 100000,
    validateStatus: () => true, // handle errors manually
  });

  try {
    const response = await instance({
      method: options.method || "GET",
      url: `${API_BASE_URL}${endpoint}`,
      data: options.body,
      withCredentials: true,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });

    // Handle Unauthorized
    if (response.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/login";
      return {
        isSuccess: false,
        status: 401,
        data: null,
        message: "Session expired. Please login again.",
      };
    }

    // Normalize backend response
    return {
      isSuccess: response.data?.isSuccess ?? false,
      status: response.status,
      data: response.data?.data ?? null,
      message:
        response.data?.data?.message ||
        response.data?.error ||
        "Something went wrong",
    };
  } catch (error) {
    console.error("Network Error:", error);

    return {
      isSuccess: false,
      status: 0,
      data: null,
      message: "Unable to connect. Please try again.",
    };
  }
};
