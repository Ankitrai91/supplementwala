import mongoose from "mongoose"

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: String,

    // existing (can still be used as fallback)
    logo: String,

    // ✅ NEW (recommended)
    cardImage: {
      type: String, // 500 × 666
    },

    bannerImage: {
      type: String, // 1200 × 415
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Brand", brandSchema)
