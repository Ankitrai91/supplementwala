import Order from "../models/Order.js"

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const filter = {}
    if (status) filter.status = status

    const skip = (page - 1) * limit

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .skip(skip)
      .limit(Number.parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments(filter)

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
    const order = await Order.findById(req.params.id).populate("user", "name email").populate("items.productId")

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!["PLACED", "PAID", "SHIPPED", "DELIVERED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("user", "name email")

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json({ message: "Order status updated successfully", order })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])

    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
