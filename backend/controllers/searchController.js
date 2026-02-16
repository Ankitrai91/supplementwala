import Product from "../models/Product.js"
import Brand from "../models/Brand.js"
import Category from "../models/Category.js"

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length < 2) {
      return res.json({
        products: [],
        brands: [],
        categories: [],
      })
    }

    const regex = new RegExp(q.trim(), "i")

    const [products, brands, categories] = await Promise.all([
      Product.find({ name: regex, isActive: true })
        .select("name slug images")
        .limit(6),

      Brand.find({ name: regex, isActive: true })
        .select("name slug")
        .limit(6),

      Category.find({ name: regex, isActive: true })
        .select("name slug")
        .limit(6),
    ])

    res.json({
      products,
      brands,
      categories,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
