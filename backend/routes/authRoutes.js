import express from "express"
import { register, login, getProfile, updateProfile } from "../controllers/authController.js"
import {  authorize } from "../middleware/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
// router.get("/profile", authorize, getProfile)
// router.put("/profile", authorize, updateProfile)

export default router
