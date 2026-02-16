import express from "express"
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/productController.js"
import {
  getVariantsByProduct,
  getVariantById,
  createVariant,
  updateVariant,
  updateVariantStock,
  deleteVariant,
} from "../controllers/variantController.js"

const router = express.Router()

// Product routes
router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.get("/slug/:slug", getProductBySlug)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)
router.get("/related/:id", getRelatedProducts)


// Variant routes
router.get("/:productId/variants", getVariantsByProduct)
router.get("/variants/:id", getVariantById)
router.post("/variants", createVariant)
router.put("/variants/:id", updateVariant)
router.patch("/variants/:id/stock", updateVariantStock)
router.delete("/variants/:id", deleteVariant)

export default router
