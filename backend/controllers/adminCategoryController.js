import Category from "../models/Category.js"

export const createCategory = async (req, res) => {
  try {
    console.log("Uploaded files:", req.files); // Debugging line
    console.log("Request body:", req.body); // Debugging line
    const { name, slug, description, parent,discountText  } = req.body

    if (!name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const existingCategory = await Category.findOne({
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    })
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" })
    }
     // ✅ CLOUDINARY URLS
    const cardImage =
      req.files?.cardImage?.[0]?.path || ""

    const coverImage =
      req.files?.coverImage?.[0]?.path || ""

    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description,
      parent: parent || null,
       // 🔥 Images
       cardImage,
      coverImage,

      discountText,
    })

    await category.save()
    res.status(201).json({ message: "Category created successfully", category })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!category) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.json({ message: "Category updated successfully", category })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ error: "Category not found" })
    }

    category.isActive = !category.isActive
    await category.save()

    res.json({ message: "Category status updated", category })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
