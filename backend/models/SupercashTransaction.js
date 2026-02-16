import mongoose from "mongoose"

const supercashTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["EARNED", "REDEEMED"],
      required: true,
    },
    description: String,
  },
  { timestamps: true },
)

export default mongoose.model("SupercashTransaction", supercashTransactionSchema)
