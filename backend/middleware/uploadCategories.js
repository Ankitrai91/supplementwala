import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "supplementwala/categories", // 🔥 clean folder structure
    allowed_formats: ["jpg", "png", "webp", "avif"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
  },
})

export const uploadCategoryImages = multer({
  storage: categoryStorage,
}).fields([
  { name: "cardImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
])
