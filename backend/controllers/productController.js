import mongoose from "mongoose"
import Category from "../models/Category.js"
import Product from "../models/Product.js"
import Variant from "../models/Variant.js"


export const getAllProducts = async (req, res) => {
  
  try {
    const {
      page = 1,
      limit = 12,
      brand,
      category,
      categorySlug,
      benefit,
      search,
    } = req.query

    const filter = { isActive: true }

    // ✅ Brand
     if (brand) {
      const brandIds = brand
        .split(",")
        .filter(id => mongoose.Types.ObjectId.isValid(id))

      if (brandIds.length) {
        filter.brand = { $in: brandIds }
      }
    }


    // ✅ Category by ID
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category
    }

    // ✅ Category by slug
    if (categorySlug) {
      const categoryDoc = await Category.findOne({ slug: categorySlug })
      if (categoryDoc) {
        filter.category = categoryDoc._id
      }
    }

    // ✅ Benefit
    if (benefit) filter.benefits = benefit

    // ✅ Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const products = await Product.find(filter)
      .populate("brand")
      .populate("category")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean()

    const total = await Product.countDocuments(filter)

    // 🔥 ENRICH PRODUCTS
    const productsWithDisplay = await Promise.all(
      products.map(async (product) => {
        // 🟢 SIMPLE PRODUCT
        if (!product.hasVariants) {
          return {
            ...product,
            displayPrice: product.price,
            displayMrp: product.mrp,
            displayImage: product.images?.[0] || null,
            defaultVariant: null,
          }
        }

        // 🟢 VARIANT PRODUCT → CHEAPEST IN-STOCK VARIANT
        const variants = await Variant.find({
          product: product._id,
          isActive: true,
          stock: { $gt: 0 },
        })
          .sort({ price: 1 }) // 🔥 LOWEST PRICE FIRST
          .lean()

        if (!variants.length) {
          return {
            ...product,
            displayPrice: null,
            displayMrp: null,
            displayImage: null,
            defaultVariant: null,
          }
        }

        const cheapest = variants[0]

        return {
          ...product,
          displayPrice: cheapest.price,
          displayMrp: cheapest.mrp,
          displayImage:
            cheapest?.images?.[0] ||
            product.thumbnail ||
            product.images?.[0] ||
            null
          ,
          defaultVariant: cheapest,
        }
      })
    )

    res.json({
      products: productsWithDisplay,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("brand").populate("category")

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Get variants for this product
    const variants = await Variant.find({ product: req.params.id, isActive: true })

    res.json({
      ...product.toObject(),
      variants,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("brand").populate("category")

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    const variants = await Variant.find({ product: product._id, isActive: true })

    res.json({
      ...product.toObject(),
      variants,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      brand,
      category,
      benefits,
      description,
      thumbnail,
      supercashPercent,
      hasVariants,
      variantTypes,
    } = req.body

    const product = new Product({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      brand,
      category,
      benefits,
      description,
      thumbnail,
      supercashPercent,
      hasVariants,
      variantTypes,
    })

    await product.save()
    await product.populate("brand category")

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("brand category")

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    await Variant.deleteMany({ product: req.params.id })
    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id).lean()
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Fetch candidate products (same category OR brand)
    const candidates = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [
        { category: product.category },
        { brand: product.brand },
      ],
    })
      .populate("brand category")
      .lean()

    const scoredProducts = candidates.map(p => {
      let score = 0

      // 🎯 Same category + same brand
      if (
        p.category?.toString() === product.category?.toString() &&
        p.brand?.toString() === product.brand?.toString()
      ) {
        score += 50
      }

      // 🎯 Same category
      if (p.category?.toString() === product.category?.toString()) {
        score += 30
      }

      // 🎯 Same brand
      if (p.brand?.toString() === product.brand?.toString()) {
        score += 20
      }

      // 🎯 Benefit similarity
      if (product.benefits?.length && p.benefits?.length) {
        const overlap = p.benefits.filter(b =>
          product.benefits.includes(b)
        )
        score += overlap.length * 15
      }

      // 🎯 Price similarity (within 20%)
      if (product.price && p.price) {
        const diff = Math.abs(product.price - p.price)
        const threshold = product.price * 0.2
        if (diff <= threshold) {
          score += 10
        }
      }

      return { ...p, score }
    })

    // Sort by score descending
    scoredProducts.sort((a, b) => b.score - a.score)

    const topProducts = scoredProducts.slice(0, 8)

    res.json({ products: topProducts })
  } catch (error) {
    console.error("RELATED ERROR:", error)
    res.status(500).json({ error: error.message })
  }
}

