import express from "express"
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js"

const router = express.Router()

router.get("/", getAllBrands)
router.get("/:id", getBrandById)
router.post("/", createBrand)
router.put("/:id", updateBrand)
router.delete("/:id", deleteBrand)

export default router
