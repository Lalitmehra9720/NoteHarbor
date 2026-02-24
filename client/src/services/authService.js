import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", formData);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};