import Category from "../models/Category.js"

export const getAllCategories = async (req, res) => {
  try {
    const { parent } = req.query
    const filter = { isActive: true }

    if (parent) {
      filter.parent = parent === "null" ? null : parent
    }

    const categories = await Category.find(filter).sort({ name: 1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent")

    if (!category) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getCategoryWithSubcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ error: "Category not found" })
    }

    const subcategories = await Category.find({ parent: req.params.id, isActive: true })

    res.json({
      ...category.toObject(),
      subcategories,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parent, image } = req.body

    if (!name) {
      return res.status(400).json({ error: "Name is required" })
    }

    if (slug) {
      const existingCategory = await Category.findOne({ slug })
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" })
      }
    }

     const cardImage =
      req.files?.cardImage?.[0]?.path || ""

    const coverImage =
      req.files?.coverImage?.[0]?.path || ""

    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      parent: parent || null,
      image,
      cardImage,
      coverImage,
    })

    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(category)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
