"use client"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { productService } from "../services/productService"
import { clearAuth } from "../store/slices/authSlice"
import "./Header.css"



export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)


  
  const timeoutRef = useRef(null)
  
  const cartItems = useSelector((state) => state.cart.items || [])
  // const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCount = useSelector((state) => state.cart.totalItems)

  
  // 🔍 SEARCH
  const handleSearch = (value) => {
    setQuery(value)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (!value || value.length < 2) {
      setResults(null)
      return
    }

    timeoutRef.current = setTimeout(async () => {
      const res = await productService.searchGlobal(value)
      setResults(res.data)
    }, 300)
  }

  // 🚀 NAVIGATION
  const handleSelect = (type, item) => {
    setQuery("")
    setResults(null)

    if (type === "product") navigate(`/product/${item.slug}`)
    if (type === "brand") navigate(`/brands?brand=${item._id}`)
    if (type === "category") navigate(`/categories?category=${item._id}`)
  }

  // 🔐 LOGOUT
  const handleLogout = () => {
    // dispatch(logout())
    dispatch(clearAuth())
  navigate("/login")
    navigate("/login")
  }

  return (
   <header className="header-wrapper">
      {/* 🔝 TOP BAR */}
      <div className="header-top">
      {/* LEFT */}
      <Link to="/" className="logo">SUPPLEMENTWALA</Link>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for products, brands or categories"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {results && (
          <div className="search-dropdown">
            {results.products?.length > 0 && (
              <>
                <p className="search-title">Products</p>
                {results.products.map(p => (
                  <div
                    key={p._id}
                    className="search-item"
                    onClick={() => handleSelect("product", p)}
                  >
                    {p.name}
                  </div>
                ))}
              </>
            )}

            {results.brands?.length > 0 && (
              <>
                <p className="search-title">Brands</p>
                {results.brands.map(b => (
                  <div
                    key={b._id}
                    className="search-item"
                    onClick={() => handleSelect("brand", b)}
                  >
                    {b.name}
                  </div>
                ))}
              </>
            )}

            {results.categories?.length > 0 && (
              <>
                <p className="search-title">Categories</p>
                {results.categories.map(c => (
                  <div
                    key={c._id}
                    className="search-item"
                    onClick={() => handleSelect("category", c)}
                  >
                    {c.name}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="header-actions">
       <Link to="/cart" className="cart-icon">
  🛒
  {cartCount > 0 && (
    <span className="cart-badge">{cartCount}</span>
  )}
</Link>


        {isAuthenticated ? (
          <div
            className="profile-wrapper"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
            {showProfile && (
              <div className="profile-dropdown">
                <Link to="/account/dashboard">Dashboard</Link>
                <Link to="/account/wallet">Wallet</Link>
                <Link to="/account/orders">Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      </div>
      <div className="header-bottom">
        <nav className="bottom-nav">
          <Link to="/shop">Shop</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/brands">Brands</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
