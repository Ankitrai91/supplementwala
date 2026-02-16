import express from "express"
import { adminOnly } from "../middleware/adminAuth.js"
import { createBrand, updateBrand, toggleBrandStatus } from "../controllers/adminBrandController.js"
import { createCategory, updateCategory, toggleCategoryStatus } from "../controllers/adminCategoryController.js"
import {
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
} from "../controllers/adminProductController.js"
import {
  createVariant,
  updateVariant,
  updateStock,
  toggleVariantStatus,
  deleteVariant,
} from "../controllers/adminVariantController.js"
import { getAllOrders, getOrderById, updateOrderStatus, getOrderStats } from "../controllers/adminOrderController.js"
import { protect } from "../middleware/auth.js"
import { uploadVariantImages } from "../middleware/upload.js"
import { uploadBrandImages } from "../middleware/uploadBrand.js"
import { uploadProductImages } from "../middleware/uploadProduct.js"
import { uploadCategoryImages } from "../middleware/uploadCategories.js"

const router = express.Router()

// Apply admin middleware to all routes
// router.use(adminOnly)
router.use(protect, adminOnly)

// Brand routes
router.post("/brands", uploadBrandImages, createBrand)
router.put("/brands/:id", updateBrand)
router.patch("/brands/:id/toggle", toggleBrandStatus)

// Category routes
router.post("/categories",uploadCategoryImages, createCategory)
router.put("/categories/:id", updateCategory)
router.patch("/categories/:id/toggle", toggleCategoryStatus)

// Product routes
// router.post("/products", createProduct)
router.post(
  "/products",
uploadProductImages,createProduct
)

router.put("/products/:id", updateProduct)
router.patch("/products/:id/toggle", toggleProductStatus)
router.delete("/products/:id", deleteProduct)

// Variant routes
router.post("/variants",  uploadVariantImages, createVariant)
router.put("/variants/:id", updateVariant)
router.patch("/variants/:id/stock", updateStock)
router.patch("/variants/:id/toggle", toggleVariantStatus)
router.delete("/variants/:id", deleteVariant)

// Order routes
router.get("/orders", getAllOrders)
router.get("/orders/:id", getOrderById)
router.patch("/orders/:id/status", updateOrderStatus)
router.get("/orders-stats", getOrderStats)

export default router
