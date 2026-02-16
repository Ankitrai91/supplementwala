import Brand from "../models/Brand.js"

export const createBrand = async (req, res) => {
  try {
    const { name, slug, description } = req.body

    if (!name) {
      return res.status(400).json({ error: "Brand name is required" })
    }

    const brandSlug = slug || name.toLowerCase().replace(/\s+/g, "-")

    const existingBrand = await Brand.findOne({ slug: brandSlug })
    if (existingBrand) {
      return res.status(400).json({ error: "Brand already exists" })
    }

    const brand = new Brand({
      name,
      slug: brandSlug,
      description,

     logo: req.files?.logo?.[0]?.path || "",

    cardImage: req.files?.cardImage?.[0]?.path || "",

    bannerImage: req.files?.bannerImage?.[0]?.path || ""
    })

    await brand.save()

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" })
    }

    res.json({ message: "Brand updated successfully", brand })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const toggleBrandStatus = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id)

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" })
    }

    brand.isActive = !brand.isActive
    await brand.save()

    res.json({ message: "Brand status updated", brand })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
