"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axiosClient from "../api/axiosClient"
import "./WalletPage.css"

function WalletPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterType, setFilterType] = useState("ALL")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    const fetchWalletData = async () => {
      try {
        setLoading(true)
        const [balanceRes, transactionsRes] = await Promise.all([
          axiosClient.get("/user/supercash"),
          axiosClient.get("/user/supercash-transactions"),
        ])

        setBalance(balanceRes.data.supercashBalance)
        setTransactions(transactionsRes.data)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch wallet data")
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [user, navigate])

  const filteredTransactions = filterType === "ALL" ? transactions : transactions.filter((t) => t.type === filterType)

  const earnedTotal = transactions.filter((t) => t.type === "EARNED").reduce((sum, t) => sum + t.amount, 0)

  const redeemedTotal = transactions.filter((t) => t.type === "REDEEMED").reduce((sum, t) => sum + t.amount, 0)

  if (loading) return <div className="loading">Loading wallet...</div>

  return (
    <div className="wallet-page">
      <div className="container">
        <h1>My Supercash Wallet</h1>

        {error && <div className="error-banner">{error}</div>}

        <div className="wallet-overview">
          <div className="balance-card primary">
            <p className="label">Current Balance</p>
            <h2 className="balance-amount">₹{balance}</h2>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Earned</p>
              <p className="stat-value earned">₹{earnedTotal}</p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Total Redeemed</p>
              <p className="stat-value redeemed">₹{redeemedTotal}</p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Transactions</p>
              <p className="stat-value">{transactions.length}</p>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Transaction History</h2>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterType === "ALL" ? "active" : ""}`}
              onClick={() => setFilterType("ALL")}
            >
              All Transactions
            </button>
            <button
              className={`filter-btn ${filterType === "EARNED" ? "active" : ""}`}
              onClick={() => setFilterType("EARNED")}
            >
              Earned
            </button>
            <button
              className={`filter-btn ${filterType === "REDEEMED" ? "active" : ""}`}
              onClick={() => setFilterType("REDEEMED")}
            >
              Redeemed
            </button>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found</p>
            </div>
          ) : (
            <div className="transactions-list">
              {filteredTransactions.map((transaction) => (
                <div key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-type">
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type === "EARNED" ? "+" : "-"}
                      </span>
                    </div>

                    <div className="transaction-details">
                      <p className="transaction-desc">
                        {transaction.type === "EARNED" ? "Earned from order" : "Redeemed in order"}
                      </p>
                      <p className="transaction-date">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="transaction-amount">
                    <span className={transaction.type.toLowerCase()}>
                      {transaction.type === "EARNED" ? "+" : "-"}₹{transaction.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="info-box">
          <h3>How Supercash Works</h3>
          <ul>
            <li>Earn Supercash on every purchase (percentage varies by product)</li>
            <li>Use your Supercash at checkout to get instant discounts</li>
            <li>Supercash is non-transferable and non-refundable</li>
            <li>Your balance is valid for 1 year from the date of earning</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WalletPage
