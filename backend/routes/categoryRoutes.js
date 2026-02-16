import express from "express"
import {
  getAllCategories,
  getCategoryById,
  getCategoryWithSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"

const router = express.Router()

router.get("/", getAllCategories)
router.get("/:id", getCategoryById)
router.get("/:id/subcategories", getCategoryWithSubcategories)
router.post("/", createCategory)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)

export default router
