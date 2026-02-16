import Product from "../models/Product.js"
import Variant from "../models/Variant.js"

export const createProduct = async (req, res) => {



  try {
    const {
      name,
      slug,
      brand,
      category,
      benefits,
      description,
      ingredients,
      additionalInfo,
      thumbnail,
      supercashPercent,
      hasVariants,
      variantTypes,
       price,
      mrp,
      stock
    } = req.body

      console.log("BODY:", req.body);
console.log("FILES:", req.files);

    const isHasVariants = hasVariants === "true" || hasVariants === true

const normalizedPrice =
  price === "" || price === undefined ? undefined : Number(price)

const normalizedMrp =
  mrp === "" || mrp === undefined ? undefined : Number(mrp)

// const images =
//   req.files?.map(file => file.path) || []

  const images = req.files.map((file, index) => ({
  url: file.path,
  order: index,
  isPrimary: index === 0,
}))



    if (!name || !brand || !category) {
      return res.status(400).json({ error: "Name, brand, and category are required" })
    }

     // 🔥 CORE RULE ENFORCEMENT
// 🔥 CORE RULE ENFORCEMENT
if (isHasVariants) {
  if (price || mrp || stock) {
    return res.status(400).json({
      error: "Price / MRP / Stock not allowed for variant products",
    })
  }

  if (!images.length) {
    return res.status(400).json({
      error: "At least one product image is required",
    })
  }
} else {
  if (!images.length || !price || !mrp || !stock) {
    return res.status(400).json({
      error: "Images, price, MRP and stock are required for simple products",
    })
  }
}



const getThumbnail = (images) => {
  if (!images?.length) return null
  return images[0]
}


  const product = new Product({
  name,
  slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
  brand,
  category,
  benefits: benefits || [],
  description,
  ingredients: ingredients || [],
  additionalInfo: additionalInfo || [],
    images,
  thumbnail: getThumbnail(images),

  supercashPercent: supercashPercent || 0,

  hasVariants: isHasVariants,
  variantTypes: isHasVariants ? variantTypes || [] : [],

  price: isHasVariants ? undefined : normalizedPrice,
  mrp: isHasVariants ? undefined : normalizedMrp,
  stock: isHasVariants ? undefined : Number(stock),
})

    await product.save()
    await product.populate("brand category")

    res.status(201).json({ message: "Product created successfully", product })
  } catch (error) {
  console.log("❌ CREATE PRODUCT ERROR:");
  console.log("MESSAGE:", error?.message);
  console.log("STACK:", error?.stack);
  console.log("FULL ERROR:", error);

  res.status(500).json({
    error: error?.message || "Internal server errors",
  });
}
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("brand category")

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json({ message: "Product updated successfully", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    product.isActive = !product.isActive
    await product.save()

    res.json({ message: "Product status updated", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Delete associated variants
    await Variant.deleteMany({ product: req.params.id })

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
