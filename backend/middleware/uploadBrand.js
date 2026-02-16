import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const brandStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "supplementwala/brands", // 🔥 cloud folder
    allowed_formats: ["jpg", "png", "webp", "avif"],
    transformation: [
      { width: 600, height: 600, crop: "limit", quality: "auto" }
    ],
  },
})

export const uploadBrandImages = multer({
  storage: brandStorage,
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "cardImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
])
