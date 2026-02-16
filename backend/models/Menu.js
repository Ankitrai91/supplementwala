import mongoose from "mongoose"

const menuItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  href: String,
  categoryId: mongoose.Schema.Types.ObjectId,
  submenu: [mongoose.Schema.Types.Mixed],
})

const menuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    items: [menuItemSchema],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Menu", menuSchema)
