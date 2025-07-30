import axiosInstance from "../AxiosInstance";

export const GetData = async (type) => {
  try {
    const response = await axiosInstance.get("/management/" + type);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateData = async (data) => {
  try {
    const response = await axiosInstance.put("/management/update/data", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateData = async (data) => {
  try {
    const response = await axiosInstance.post("/management/create/data", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const DeleteData = async (data) => {
  try {
    const response = await axiosInstance.post("/management/delete/data", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}