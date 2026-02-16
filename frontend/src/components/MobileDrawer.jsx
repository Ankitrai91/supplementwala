"use client"

import { Link } from "react-router-dom"
import "./MobileDrawer.css"

export default function MobileDrawer({ open, onClose }) {
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}

      <aside className={`mobile-drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <span>MENU</span>
          <button onClick={onClose}>✕</button>
        </div>

        <nav className="drawer-nav">
          <Link to="/shop" onClick={onClose}>Shop</Link>
          <Link to="/categories" onClick={onClose}>Categories</Link>
          <Link to="/brands" onClick={onClose}>Brands</Link>
          <Link to="/about" onClick={onClose}>About</Link>
          <Link to="/contact" onClick={onClose}>Contact</Link>
        </nav>

        <div className="drawer-divider" />

        <nav className="drawer-nav">
          <Link to="/account/dashboard" onClick={onClose}>Dashboard</Link>
          <Link to="/account/orders" onClick={onClose}>Orders</Link>
          <Link to="/account/wallet" onClick={onClose}>Wallet</Link>
          <Link to="/login" onClick={onClose}>Login / Logout</Link>
        </nav>
      </aside>
    </>
  )
}
