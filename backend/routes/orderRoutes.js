import express from "express"
import { getUserOrders, getOrderById, createOrder } from "../controllers/orderController.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

router.use(auth)

router.get("/", getUserOrders)
router.get("/:id", getOrderById)
router.post("/", createOrder)

export default router
