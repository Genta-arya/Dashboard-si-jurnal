import axiosInstance from "../AxiosInstance";

export const GetJurnalHarian = async (data) => {
  try {
    const response = await axiosInstance.post("/journal/harian/data", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const GetJurnalTahunan = async (data) => {
  try {
    const response = await axiosInstance.post("/journal/tahunan/data", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const GetJurnalById = async (id , year) => {
  try {
    const response = await axiosInstance.get(`/journal/data/${id}?year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetJurnalByname = async (name_kelas, year) => {
  try {
    const response = await axiosInstance.get(
      `/journal/data/kelas/${name_kelas}?year=${year} `
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
