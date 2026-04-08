import axiosInstance from "../utils/axiosInstance";

export const submitFeedback = async (data) => {
  const res = await axiosInstance.post("/feedback", data);
  return res.data;
};