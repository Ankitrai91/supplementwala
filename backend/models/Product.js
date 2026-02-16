import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

      // 👇 used when NO variants
price: {
  type: Number,
},
mrp: {
  type: Number,
},
stock: Number,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

 // ✅ CONTENT SECTIONS
    description: String,
    ingredients: String,
    additionalInfo: String,

    // ✅ BULLET BENEFITS
    benefits: [String],
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variantTypes: {
      type: [String],
      default: [],
    },
images: [
  {
    url: String,
    order: Number,
    isPrimary: Boolean,
  }
],


    supercashPercent: {
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

export default mongoose.model("Product", productSchema)
