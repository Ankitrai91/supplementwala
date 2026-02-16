import Menu from '../models/Menu.js'

// Get all menu items organized by category
export const getMenuStructure = async (req, res) => {
  try {
    const menuItems = await Menu.find({ isActive: true })
      .populate('categoryId', 'name slug')
      .populate('brandIds', 'name slug')
      .sort({ order: 1 })

    // Organize menu by category
    const menuByCategory = {}
    menuItems.forEach((item) => {
      const categoryName = item.categoryId?.name || 'Other'
      if (!menuByCategory[categoryName]) {
        menuByCategory[categoryName] = []
      }
      menuByCategory[categoryName].push(item)
    })

    res.status(200).json({
      success: true,
      data: menuByCategory,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get mega menu structure (for header display)
export const getMegaMenu = async (req, res) => {
  try {
    const megaMenu = await Menu.find({ isActive: true, isMegaMenu: true })
      .populate('categoryId', 'name slug image')
      .populate('brandIds', 'name slug image')
      .sort({ order: 1 })
      .limit(10)

    const formattedMenu = megaMenu.map((item) => ({
      id: item._id,
      title: item.title,
      category: item.categoryId,
      brands: item.brandIds,
      icon: item.icon,
      link: `/category/${item.categoryId?.slug}`,
    }))

    res.status(200).json({
      success: true,
      data: formattedMenu,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get featured items for homepage
export const getFeaturedItems = async (req, res) => {
  try {
    const featured = await Menu.find({
      isActive: true,
      isFeatured: true,
    })
      .populate('categoryId', 'name slug')
      .populate('brandIds', 'name slug')
      .sort({ order: 1 })
      .limit(6)

    res.status(200).json({
      success: true,
      data: featured,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Admin: Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const { title, categoryId, brandIds, icon, order, isMegaMenu, isFeatured } = req.body

    const menuItem = new Menu({
      title,
      categoryId,
      brandIds,
      icon,
      order: order || 999,
      isMegaMenu: isMegaMenu || false,
      isFeatured: isFeatured || false,
      isActive: true,
    })

    await menuItem.save()
    await menuItem.populate('categoryId brandIds')

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Admin: Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params
    const menuItem = await Menu.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('categoryId brandIds')

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

// Admin: Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params
    const menuItem = await Menu.findByIdAndDelete(id)

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Admin: Reorder menu items
export const reorderMenuItems = async (req, res) => {
  try {
    const { items } = req.body // Array of { id, order }

    for (const item of items) {
      await Menu.findByIdAndUpdate(item.id, { order: item.order })
    }

    res.status(200).json({
      success: true,
      message: 'Menu items reordered successfully',
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}
