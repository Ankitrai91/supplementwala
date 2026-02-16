"use client"

import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { addToCart } from "../store/slices/cartSlice"
import "./ProductCard.css"
import { getImageUrl } from "../utils/imageUrl"
import ChooseOptionDrawer from "./ChooseOptionDrawer"

function ProductCard({ product, variants = [] }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)

  const [selectedVariant, setSelectedVariant] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const firstAvailable = variants.find(v => v.stock > 0)
    setSelectedVariant(firstAvailable || null)
  }, [variants])

  const hero =
  product.images?.sort((a,b)=>a.order-b.order)[0]?.url

  const isOutOfStock = product.hasVariants
    ? false
    : product.stock <= 0

  const sellingPrice =
    product.displayPrice ||
    selectedVariant?.price ||
    product.price

  const mrpPrice =
    selectedVariant?.mrp || product.mrp

  const discount =
    mrpPrice && sellingPrice
      ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
      : 0

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    dispatch(addToCart({
      productId: product._id,
      variantId: selectedVariant?._id,
      quantity: 1,
    }))
  }

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div
        className="product-image"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={getImageUrl(hero)}
          alt={product.name}
        />

        {discount > 0 && (
          <span className="discount-tag">{discount}% OFF</span>
        )}
      </div>

      {/* INFO */}
      <div className="product-info">

        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>
            {product.name}
          </Link>
        </h3>

        {product.brand && (
          <p className="product-brand">{product.brand.name}</p>
        )}

        <div className="price-row">
          <span className="selling">₹{sellingPrice}</span>

          {mrpPrice && mrpPrice > sellingPrice && (
            <span className="mrp">₹{mrpPrice}</span>
          )}
        </div>

        {/* CTA */}
        {isOutOfStock ? (
          <button className="btn-disabled">Out of Stock</button>
        ) : product.hasVariants ? (
          <button className="btn-primary" onClick={() => setOpen(true)}>
            Choose Options
          </button>
        ) : (
          <button className="btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}

      </div>

      {open && (
        <ChooseOptionDrawer
          open={open}
          onClose={() => setOpen(false)}
          productId={product._id}
        />
      )}
    </div>
  )
}

export default ProductCard
