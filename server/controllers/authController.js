import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import { generateOtp, getOtpExpiry } from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";

const OTP_EXPIRY_MINUTES = 10;

const normalizeEmail = (email = "") => email.toLowerCase().trim();

const sendOtpMail = async ({ email, otp, subject }) => {
  await sendEmail({
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${subject}</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
      </div>
    `,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    await Otp.deleteMany({ email: normalizedEmail, purpose: "register" });

    await Otp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      purpose: "register",
      expiresAt: getOtpExpiry(OTP_EXPIRY_MINUTES),
      name,
      password: hashedPassword,
    });

    await sendOtpMail({
      email: normalizedEmail,
      otp,
      subject: "Verify your Notes App account",
    });

    res.status(200).json({
      message: "OTP sent to your email",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "register",
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: "Too many OTP attempts" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: otpRecord.name,
      email: normalizedEmail,
      password: otpRecord.password,
    });

    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email: normalizedEmail, purpose: "reset" });

    await Otp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      purpose: "reset",
      expiresAt: getOtpExpiry(OTP_EXPIRY_MINUTES),
    });

    await sendOtpMail({
      email: normalizedEmail,
      otp,
      subject: "Reset your Notes App password",
    });

    res.json({ message: "Password reset OTP sent", email: normalizedEmail });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "reset",
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ message: "Too many OTP attempts" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    otpRecord.verified = true;
    otpRecord.resetToken = await bcrypt.hash(resetToken, 10);
    await otpRecord.save();

    res.json({
      message: "OTP verified",
      resetToken,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("VERIFY RESET OTP ERROR:", error);
    res.status(500).json({ message: "Reset OTP verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !resetToken || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "reset",
      verified: true,
    }).sort({ updatedAt: -1 });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Reset session expired" });
    }

    const isTokenValid = await bcrypt.compare(resetToken, otpRecord.resetToken);

    if (!isTokenValid) {
      return res.status(400).json({ message: "Invalid reset session" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};
