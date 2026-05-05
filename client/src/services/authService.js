import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", formData);
  return data;
};

export const verifyRegistrationOtp = async (formData) => {
  const { data } = await axiosInstance.post("/auth/verify-otp", formData);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
};

export const sendForgotPasswordOtp = async (formData) => {
  const { data } = await axiosInstance.post("/auth/forgot-password", formData);
  return data;
};

export const verifyResetOtp = async (formData) => {
  const { data } = await axiosInstance.post("/auth/verify-reset-otp", formData);
  return data;
};

export const resetPassword = async (formData) => {
  const { data } = await axiosInstance.post("/auth/reset-password", formData);
  return data;
};
