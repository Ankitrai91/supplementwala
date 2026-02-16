import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { cartService } from "../services/cartService"
import { addToCart } from "../store/slices/cartSlice"
import "/src/styles/ProductDealCard.css"
import { getImageUrl } from "../utils/imageUrl"

export default function ProductDealCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const hasVariants = product.variants && product.variants.length > 0

  const handleDirectAddToCart = async () => {
    try {
      const variant = product.variants?.[0] // safe fallback

      await cartService.addToCart({
        productId: product._id,
        variantId: variant?._id || null,
        quantity: 1,
      })

      dispatch(
        addToCart({
          productId: product._id,
          variantId: variant?._id || null,
          productName: product.name,
          price: variant?.price || product.price,
          quantity: 1,
        })
      )

      alert("Added to cart")
    } catch (err) {
      alert("Failed to add to cart")
    }
  }

  return (
    <div className="deal-card">
      <img load="lazy"
        src={getImageUrl(product.images && product.images.length > 0
          ? product.images[0]
          : "/placeholder.svg")}
        alt={product.name}
        className="deal-image"
        onClick={() => navigate(`/product/${product._id}`)}
      />

      <div className="deal-info">
        <h3 className="deal-name">{product.name}</h3>

        {product.brand && (
          <p className="deal-brand">{product.brand.name}</p>
        )}

        <div className="deal-price">
          ₹{product.variants?.[0]?.price || "View Options"}
        </div>

        {/* 🔥 ACTION BUTTON */}
        {hasVariants ? (
          <button
            className="btn choose-btn"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            Choose Options
          </button>
        ) : (
          <button
            className="btn add-btn"
            onClick={handleDirectAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
