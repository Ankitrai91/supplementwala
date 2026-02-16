import Order from "../models/Order.js"
import Cart from "../models/Cart.js"
import User from "../models/User.js"
import Variant from "../models/Variant.js"
import SupercashTransaction from "../models/SupercashTransaction.js"

export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const orders = await Order.find({ user: req.user._id })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments({ user: req.user._id })

    res.json({
      orders,
      pagination: {
        total,
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order || order.user.toString() !== req.user._id) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createOrder = async (req, res) => {
  try {
    const { usedSupercash = 0, paymentMethod = "COD" } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId")
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" })
    }

    // Validate and deduct supercash
    if (usedSupercash > 0) {
      if (user.supercashBalance < usedSupercash) {
        return res.status(400).json({ error: "Insufficient Supercash balance" })
      }
    }

    // Create order items and calculate earnings
    let totalAmount = 0
    let earnedSupercash = 0
    const orderItems = []

    for (const cartItem of cart.items) {
      const variant = await Variant.findById(cartItem.variantId)
      const product = cartItem.productId

      if (!variant) {
        return res.status(404).json({ error: "Variant not found" })
      }

      // Check stock
      if (variant.stock < cartItem.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
      }

      // Deduct stock
      variant.stock -= cartItem.quantity
      await variant.save()

      // Calculate supercash earned
      const itemSupercash = (variant.price * cartItem.quantity * (product.supercashPercent || 0)) / 100
      earnedSupercash += itemSupercash

      totalAmount += variant.price * cartItem.quantity

      orderItems.push({
        productId: product._id,
        variantId: variant._id,
        productName: product.name,
        flavor: variant.flavor,
        size: variant.size,
        price: variant.price,
        quantity: cartItem.quantity,
      })
    }

    // Apply used supercash
    const finalAmount = Math.max(0, totalAmount - usedSupercash)

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: finalAmount,
      earnedSupercash,
      usedSupercash,
      status: "PLACED",
      paymentMethod,
    })

    await order.save()

    // Update user supercash balance
    if (usedSupercash > 0) {
      user.supercashBalance -= usedSupercash
      await SupercashTransaction.create({
        user: req.user._id,
        orderId: order._id,
        amount: usedSupercash,
        type: "REDEEMED",
        description: `Redeemed in order ${order._id}`,
      })
    }

    // Add earned supercash
    if (earnedSupercash > 0) {
      user.supercashBalance += earnedSupercash
      await SupercashTransaction.create({
        user: req.user._id,
        orderId: order._id,
        amount: earnedSupercash,
        type: "EARNED",
        description: `Earned from order ${order._id}`,
      })
    }

    await user.save()

    // Clear cart
    cart.items = []
    await cart.save()

    res.status(201).json({
      message: "Order created successfully",
      order,
      supercashUpdated: {
        earned: earnedSupercash,
        redeemed: usedSupercash,
        newBalance: user.supercashBalance,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
