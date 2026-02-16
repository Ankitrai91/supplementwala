import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/database.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import brandRoutes from "./routes/brandRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"
import path from "path"
import { fileURLToPath } from "url"



dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 👇 THIS IS THE KEY
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

  
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

// Connect to database
connectDB()

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/menu", menuRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/search", searchRoutes)


app.get("/api/user/profile", (req, res) => {
  res.json({ route: "HIT /api/user/profile" })
})


// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
