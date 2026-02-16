'use client';

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { userService } from '../services/userService'

export default function Shop() {
  const user = useSelector((state) => state.auth.user)
  const [orders, setOrders] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching profile and orders from API")
        
        const [profileResponse, ordersResponse] = await Promise.all([
          userService.getProfile(),
          userService.getUserOrders(),
        ])
        
        console.log("[v0] Profile data received:", profileResponse.data)
        console.log("[v0] Orders data received:", ordersResponse.data)
        
        setProfile(profileResponse.data)
        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.orders || [])
      } catch (error) {
        console.error('[v0] Failed to fetch dashboard data:', error)
        setError(error.response?.data?.message || 'Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (loading) {
    return <div className="dashboard-loader">Loading your dashboard...</div>
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>
  }

  if (!profile) {
    return <div className="dashboard-error">Failed to load profile</div>
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Account</h1>
        <p className="user-email">{profile.email}</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{orders.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Supercash Balance</div>
                <div className="stat-value currency">
                  ₹{profile.supercashBalance || 0}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Spent</div>
                <div className="stat-value currency">
                  ₹
                  {orders
                    .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                    .toFixed(2)}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Member Since</div>
                <div className="stat-value date">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <Link to="/account/wallet" className="action-button primary">
                View Wallet
              </Link>
              <Link to="account/profile/edit" className="action-button secondary">
                Edit Profile
              </Link>
              <Link to="/products" className="action-button secondary">
                Continue Shopping
              </Link>
            </div>

            <div className="recent-orders">
              <h3>Recent Orders</h3>
              {orders.slice(0, 3).length > 0 ? (
                <div className="orders-list">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <div className="order-id">Order #{order._id}</div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-total">₹{order.totalAmount}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-orders">No orders yet. Start shopping!</p>
              )}
              {orders.length > 3 && (
                <Link to="#orders" className="view-all-link">
                  View all orders →
                </Link>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h3>Order History</h3>
            {orders.length > 0 ? (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <div className="order-number">Order #{order._id}</div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <span>{item.quantity}x</span>
                          <span>{item.variantId?.sku}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="order-total">₹{order.totalAmount}</div>
                      <Link
                        to={`/order/${order._id}`}
                        className="order-link"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-orders">
                No orders found.{' '}
                <Link to="/products">Start shopping now</Link>
              </p>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <h3>Profile Information</h3>
            <div className="profile-info">
              <div className="info-field">
                <label>Email</label>
                <p>{profile.email}</p>
              </div>
              <div className="info-field">
                <label>Phone</label>
                <p>{profile.phone || 'Not provided'}</p>
              </div>
              <div className="info-field">
                <label>Address</label>
                <p>{profile.address || 'Not provided'}</p>
              </div>
              <div className="info-field">
                <label>City</label>
                <p>{profile.city || 'Not provided'}</p>
              </div>
              <div className="info-field">
                <label>Pincode</label>
                <p>{profile.pincode || 'Not provided'}</p>
              </div>
            </div>
            <Link to="/profile/edit" className="action-button primary">
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
