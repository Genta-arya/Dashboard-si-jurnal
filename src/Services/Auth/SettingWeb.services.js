import axiosInstance from "../AxiosInstance";

export const GetDataWeb = async () => {
  try {
    const response = await axiosInstance.get("/setting/data");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateDataWeb = async (data) => {
  try {
    const response = await axiosInstance.post("/setting/update/data", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
