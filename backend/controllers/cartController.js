import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import Variant from "../models/Variant.js"

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.productId").populate("items.variantId")

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    let price = 0
    let flavor = null
    let size = null

    // 🟢 CASE 1 — PRODUCT HAS VARIANT
    if (variantId) {
      const variant = await Variant.findById(variantId)

      if (!variant) {
        return res.status(404).json({ error: "Variant not found" })
      }

      price = variant.price
      flavor = variant.flavor
      size = variant.size
    }

    // 🟢 CASE 2 — SIMPLE PRODUCT
    else {
      if (product.hasVariants) {
        return res.status(400).json({
          error: "Variant required for this product",
        })
      }

      price = product.price
    }

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    // 🔥 MERGE LOGIC (VERY IMPORTANT)
    const existingItem = cart.items.find((item) => {
      if (variantId) {
        return item.variantId?.toString() === variantId
      }
      return item.productId.toString() === productId && !item.variantId
    })

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({
        productId,
        variantId: variantId || null,
        flavor,
        size,
        price,
        quantity,
      })
    }

    await cart.save()
    await cart.populate("items.productId")

    res.json({ message: "Item added to cart", cart })

  } catch (error) {
    console.log("❌ ADD TO CART ERROR:", error)
    res.status(500).json({ error: error.message })
  }
}


export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const { variantId } = req.params

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    console.log("Updating cart for user ID:", req.user._id)
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    const item = cart.items.find((item) => item.variantId.toString() === variantId)
    if (!item) {
      return res.status(404).json({ error: "Item not in cart" })
    }

    item.quantity = quantity
    await cart.save()

    res.json({ message: "Cart item updated", cart })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const removeFromCart = async (req, res) => {
  try {
    const { variantId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.variantId.toString() !== variantId)
    await cart.save()

    res.json({ message: "Item removed from cart", cart })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = []
    await cart.save()

    res.json({ message: "Cart cleared", cart })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
