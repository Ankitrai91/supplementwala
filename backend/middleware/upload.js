import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const variantStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "supplementwala/variants", // 👈 separate folder
    allowed_formats: ["jpg", "png", "webp", "avif"],
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  }),
})

export const uploadVariantImages =
  multer({ storage: variantStorage }).array("images", 10)
