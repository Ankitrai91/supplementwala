import Variant from "../models/Variant.js"

export const createVariant = async (req, res) => {
  try {

     const images =
      req.files?.map(file => file.path) || []


    const { productId, flavor, size, price, mrp, stock } = req.body

    if (!productId || !price || stock === undefined) {
      return res.status(400).json({ error: "productId, price, and stock are required" })
    }

    const variant = new Variant({
      product: productId,
      flavor,
      size,
      price,
      mrp: mrp || price,
      stock,
      images: images || [],
    })

    await variant.save()
    await variant.populate("product")

    res.status(201).json({ message: "Variant created successfully", variant })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("product")

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" })
    }

    res.json({ message: "Variant updated successfully", variant })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body

    if (stock === undefined) {
      return res.status(400).json({ error: "Stock quantity is required" })
    }

    const variant = await Variant.findByIdAndUpdate(req.params.id, { stock }, { new: true })

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" })
    }

    res.json({ message: "Stock updated successfully", variant })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const toggleVariantStatus = async (req, res) => {
  try {
    const variant = await Variant.findById(req.params.id)

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" })
    }

    variant.isActive = !variant.isActive
    await variant.save()

    res.json({ message: "Variant status updated", variant })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findByIdAndDelete(req.params.id)

    if (!variant) {
      return res.status(404).json({ error: "Variant not found" })
    }

    res.json({ message: "Variant deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
