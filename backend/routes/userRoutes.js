import express from "express"
import {
  getUserSupercash,
  getSupercashTransactions,
  addSupercash,
  redeemSupercash,
} from "../controllers/userController.js"
// import { auth } from "../middleware/auth.js"
import { protect } from "../middleware/auth.js"
import { getProfile, updateProfile } from "../controllers/authController.js"
import { getOrderById, getUserOrders } from "../controllers/orderController.js"


const router = express.Router()


// ✅ Profile
router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)

// ✅ Orders
router.get("/orders", protect, getUserOrders)
router.get("/orders/:id", protect, getOrderById)


router.get("/supercash", protect, getUserSupercash)
router.get("/supercash-transactions", protect, getSupercashTransactions)
router.post("/supercash/add", protect, addSupercash)
router.post("/supercash/redeem", protect, redeemSupercash)

export default router
