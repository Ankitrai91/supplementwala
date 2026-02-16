import Variant from "../models/Variant.js"

export const getVariantsByProduct = async (req, res) => {
  try {
    const variants = await Variant.find({
      product: req.params.productId,
      isActive: true,
    })

    res.json(variants)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getVariantById = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id).populate("product")

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" })
    }

    res.json(variant)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createVariant = async (req, res) => {
  try {
    const { productId, flavor, size, price, mrp, stock, images } = req.body

    const variant = new Variant({
      product: productId,
      flavor,
      size,
      price,
      mrp,
      stock,
      images,
    })

    await variant.save()
    await variant.populate("product")

    res.status(201).json(variant)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("product")

    res.json(variant)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateVariantStock = async (req, res) => {
  try {
    const { stock } = req.body

    const variant = await Variant.findByIdAndUpdate(req.params.id, { stock }, { new: true })

    res.json({
      message: "Stock updated successfully",
      variant,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteVariant = async (req, res) => {
  try {
    await Variant.findByIdAndDelete(req.params.id)
    res.json({ message: "Variant deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
