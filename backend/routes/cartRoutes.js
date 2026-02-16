import express from "express"
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.use(protect)

router.get("/", protect, getCart)
router.post("/add", addToCart)
router.patch("/:variantId", updateCartItem)
router.delete("/:variantId", removeFromCart)
router.delete("/", clearCart)

export default router
