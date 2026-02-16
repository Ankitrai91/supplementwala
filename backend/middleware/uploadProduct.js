import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "supplementwala/products",
    allowed_formats: ["jpg", "png", "webp", "avif"],
    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
  }),
})

export const uploadProductImages =
  multer({ storage: productStorage }).array("images", 10)
