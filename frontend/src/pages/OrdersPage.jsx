'use client';

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/userService'
import './OrdersPage.css'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await userService.getUserOrders()
      setOrders(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'processing':
        return 'status-processing'
      case 'shipped':
        return 'status-shipped'
      case 'delivered':
        return 'status-delivered'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return ''
    }
  }

  if (loading) return <div className="loading">Loading your orders...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <Link to="/account/dashboard" className="back-link">Back to Dashboard</Link>
      </div>

      <div className="container">
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`order-status ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="item-name">
                        {item.productName} ({item.variant})
                      </span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                      <span className="item-price">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  {order.supercashUsed > 0 && (
                    <div className="summary-row">
                      <span>Supercash Used:</span>
                      <span>-₹{order.supercashUsed.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <Link to={`/orders/${order._id}`} className="btn-view">
                    View Details
                  </Link>
                  {order.status === 'pending' && (
                    <button className="btn-cancel">Cancel Order</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping now!</p>
            <Link to="/" className="btn-shop">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
