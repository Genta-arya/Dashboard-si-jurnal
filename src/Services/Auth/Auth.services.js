import axios from "axios";
import axiosInstance from "../AxiosInstance";

export const ServiceLogin = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username: data.username,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ServiceSession = async (token) => {
  try {
    const response = await axiosInstance.post("/auth/session", {
      token,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ServiceLogout = async (token) => {
  try {
    const response = await axiosInstance.post("/auth/logout", {
      token,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UPLOAD_URL = "https://cloud.mystorages.my.id/uploads.php";

export const uploadGambar = async (data) => {
  try {
    const response = await axios.post(UPLOAD_URL, data, {
      headers: {
        genta: "Genta@456",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
