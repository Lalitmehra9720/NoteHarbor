

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"; // 🔥 important

const router = express.Router();

router.put(
  "/profile-image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // 🔥 FIXED upload logic
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "noteharbor_profiles" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      const user = await User.findById(req.user._id);
      user.profileImage = result.secure_url;
      await user.save();

      res.json({ profileImage: result.secure_url });

    } catch (error) {
      console.log(error); // 🔥 important for debug
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;