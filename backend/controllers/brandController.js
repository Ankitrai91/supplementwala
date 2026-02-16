import Brand from "../models/Brand.js"

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 })
    res.json(brands)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id)
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" })
    }
    res.json(brand)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createBrand = async (req, res) => {
  try {
    const { name, slug, description, logo } = req.body

    const brand = new Brand({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      logo,
    })

    await brand.save()
    res.status(201).json(brand)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(brand)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id)
    res.json({ message: "Brand deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
