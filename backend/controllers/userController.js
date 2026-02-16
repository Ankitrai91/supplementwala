import User from "../models/User.js"
import SupercashTransaction from "../models/SupercashTransaction.js"

export const getUserSupercash = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("supercashBalance")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      supercashBalance: user.supercashBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getSupercashTransactions = async (req, res) => {
  try {
    const transactions = await SupercashTransaction.find({
      user: req.userId,
    })
      .populate("orderId", "totalAmount status")
      .sort({ createdAt: -1 })

    res.json(transactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const addSupercash = async (req, res) => {
  try {
    const { amount, orderId, description } = req.body

    // Update user balance
    const user = await User.findByIdAndUpdate(req.userId, { $inc: { supercashBalance: amount } }, { new: true })

    // Create transaction record
    const transaction = new SupercashTransaction({
      user: req.userId,
      orderId,
      amount,
      type: "EARNED",
      description,
    })
    await transaction.save()

    res.json({
      message: "Supercash added successfully",
      supercashBalance: user.supercashBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const redeemSupercash = async (req, res) => {
  try {
    const { amount, orderId, description } = req.body

    // Check if user has sufficient balance
    const user = await User.findById(req.userId)
    if (user.supercashBalance < amount) {
      return res.status(400).json({ error: "Insufficient Supercash balance" })
    }

    // Deduct from balance
    const updatedUser = await User.findByIdAndUpdate(req.userId, { $inc: { supercashBalance: -amount } }, { new: true })

    // Create transaction record
    const transaction = new SupercashTransaction({
      user: req.userId,
      orderId,
      amount,
      type: "REDEEMED",
      description,
    })
    await transaction.save()

    res.json({
      message: "Supercash redeemed successfully",
      supercashBalance: updatedUser.supercashBalance,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
