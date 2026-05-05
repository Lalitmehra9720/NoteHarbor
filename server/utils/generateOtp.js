import crypto from "crypto";

export const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

export const getOtpExpiry = (minutes = 10) =>
  new Date(Date.now() + minutes * 60 * 1000);
