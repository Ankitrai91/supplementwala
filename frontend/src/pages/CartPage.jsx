"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cartService, orderService } from "../services/cartService.js"
import "./CartPage.css"
import { useDispatch, useSelector } from "react-redux"
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
} from "../store/slices/cartSlice"

function CartPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usedSupercash, setUsedSupercash] = useState(0)
  const [supercashAvailable, setSupercashAvailable] = useState(0)
  const [processing, setProcessing] = useState(false)

  const dispatch = useDispatch()
const cart = useSelector((state) => state.cart)


  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    const fetchCart = async () => {
      try {
        setLoading(true)
       const response = await cartService.getCart()

      dispatch(
  setCartItems(
    (response.data.items || []).map(item => ({
      ...item,
      variantId:
        typeof item.variantId === "string"
          ? item.variantId
          : item.variantId?._id,
    }))
  )
)
        setSupercashAvailable(response.data.supercash || 0)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch cart")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [isAuthenticated, navigate, dispatch])

const handleUpdateQuantity = async (variantId, quantity) => {

    if (quantity < 1) return

  const prevItem = cart.items.find(
    item => item.variantId === variantId
  )
  const prevQty = prevItem?.quantity ?? 1

   // ✅ INSTANT UI UPDATE
  dispatch(updateQuantity({ variantId, quantity }))

  try {
    const response = await cartService.updateCartItem(variantId, quantity)
  } catch (err) {
    dispatch(updateQuantity({ variantId, quantity: prevQty }))
    setError(err.response?.data?.error || "Failed to update cart")
  }
}


  const handleRemoveItem = async (variantId) => {
    // ✅ INSTANT UI UPDATE
     dispatch(removeFromCart(variantId))

    try {
      const response = await cartService.removeFromCart(variantId)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove item")
    }
  }

  const getVariantId = (variantId) => {
  if (!variantId) return null
  if (typeof variantId === "string") return variantId
  return variantId._id || null
}



  const handleCheckout = async () => {
    try {
      setProcessing(true)
      const response = await orderService.createOrder({
        usedSupercash: Math.min(usedSupercash, supercashAvailable),
        paymentMethod: "COD",
      })

      alert("Order placed successfully!")
      setUsedSupercash(0)
      dispatch(clearCart())
      navigate(`/orders/${response.data.order._id}`)
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create order")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="loading">Loading cart...</div>
  if (!isAuthenticated) return null

  const subtotal = cart.totalPrice
const finalAmount = Math.max(0, subtotal - usedSupercash)

  const maxSupercash = Math.min(supercashAvailable, subtotal)

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {error && <div className="error-banner">{error}</div>}

        {!cart || cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
<div key={`${item.variantId}`} className="cart-item">
                  <div className="item-info">
                    <h3>{item.productId?.name || "Product"}</h3>
                    <p className="item-variant">
                      {item.flavor && `Flavor: ${item.flavor}`}
                      {item.flavor && item.size && " • "}
                      {item.size && `Size: ${item.size}`}
                    </p>
                    <p className="item-price">₹{item.price}</p>
                  </div>

                <div className="item-quantity">
  <button
    onClick={() =>{
      const id = getVariantId(item.variantId)
    if (!id) return
      handleUpdateQuantity(id, item.quantity - 1)}
    }
  >
    −
  </button>

  <input type="number" value={item.quantity} readOnly />

  <button
    onClick={() =>{
      const id = getVariantId(item.variantId)
    if (!id) return
      handleUpdateQuantity(id, item.quantity + 1)
    }}
  >
    +
  </button>
</div>

<div className="item-total">
  <p>₹{item.price * item.quantity}</p>
</div>

<button
  className="btn-remove"
  onClick={() => {
    const id = getVariantId(item.variantId)
    if (!id) return
    handleRemoveItem(id)}}
>
  Remove
</button>


            

                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="supercash-section">
                <label>Use Supercash</label>
                <p className="supercash-available">Available: ₹{supercashAvailable}</p>
                <div className="supercash-input">
                  <input
                    type="number"
                    value={usedSupercash}
                    onChange={(e) => setUsedSupercash(Math.min(Number(e.target.value), maxSupercash))}
                    max={maxSupercash}
                    min={0}
                  />
                  <span>₹</span>
                </div>
              </div>

              {usedSupercash > 0 && (
                <div className="summary-row discount">
                  <span>Supercash Discount</span>
                  <span>-₹{usedSupercash}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{finalAmount}</span>
              </div>

              <button className="btn-checkout" onClick={handleCheckout} disabled={processing}>
                {processing ? "Processing..." : "Place Order"}
              </button>

              <Link to="/" className="btn-continue">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
