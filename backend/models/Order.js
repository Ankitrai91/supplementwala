import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  variantId: mongoose.Schema.Types.ObjectId,
  productName: String,
  flavor: String,
  size: String,
  price: Number,
  quantity: Number,
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    earnedSupercash: {
      type: Number,
      default: 0,
    },
    usedSupercash: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["PLACED", "PAID", "SHIPPED", "DELIVERED"],
      default: "PLACED",
    },
    paymentMethod: {
      type: String,
      default: "COD",
    },
  },
  { timestamps: true },
)

export default mongoose.model("Order", orderSchema)
