import multer from "multer";
import cloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = cloudinaryStorage({
  cloudinary,
  params: {
    folder: "M6 Pratica",
  },
});
const parser = multer({ storage: storage });

export default parser;
