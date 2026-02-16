"use client"

import { Link } from "react-router-dom"
import "/src/styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">

      {/* 🔝 TOP FOOTER */}
      <div className="footer-top container">

        {/* LEFT SUBSCRIBE */}
        <div className="footer-subscribe">
          <h2>Subscribe Today</h2>
          <p>Get update on latest content updates, offers and more...</p>

          <div className="subscribe-box">
            <input type="email" placeholder="Your Email Address" />
            <button>SUBSCRIBE</button>
          </div>
        </div>

        <div className="footer-link-head">

        {/* SHOP LINKS */}
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/combo">Combo Deal</Link>
          <Link to="/sale">Sale</Link>
          <Link to="/account/orders">My Orders</Link>
        </div>

        {/* INFO LINKS */}
        <div className="footer-links">
          <h4>Info</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact Us</Link>
          <a href="#">Youtube Channel</a>
          <a href="#">FAQ's</a>
        </div>

        {/* LEGAL LINKS */}
        <div className="footer-links">
          <h4>Legal</h4>
          <Link to="/return-policy">Return Policy</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
          <Link to="/terms">Term</Link>
          <Link to="/privacy">Privacy</Link>
        </div>

      </div>
      </div>

      {/* 🔽 MIDDLE STRIP */}
      <div className="footer-middle container">
        <div className="footer-brand">
          <img load="lazy"
            src="/logo.png"
            alt="logo"
          />
          <div>
            <h3>100% Real Products.</h3>
            <p>Copyright © 2026 Supplementwala</p>
          </div>
        </div>

        <div className="footer-social">
          <a href="#">📷</a>
          <a href="#">✉️</a>
          <a href="#">▶️</a>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* 💳 PAYMENT + CREDIT */}
      <div className="footer-bottom container">
        <div className="payment-icons">
          <span>G Pay</span>
          <span>Paytm</span>
          <span>VISA</span>
          <span>Mastercard</span>
          <span>RuPay</span>
        </div>

        <p className="designer">
          Website Designed By <strong>BlendUs Media</strong>
        </p>
      </div>

    </footer>
  )
}
