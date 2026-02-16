import { useEffect, useState } from "react"
import { productService } from "../services/productService"
import "/src/styles/ChooseOptionDrawer.css"
import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { cartService } from "../services/cartService"
import { addToCart } from "../store/slices/cartSlice"
import { getImageUrl } from "../utils/imageUrl"


export default function ChooseOptionDrawer({ open, onClose, productId }) {
  const dispatch = useDispatch()

  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedFlavor, setSelectedFlavor] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)


  const { isAuthenticated } = useSelector(state => state.auth)
const navigate = useNavigate()



useEffect(() => {
  if (!open) return

  const fetchProduct = async () => {
    const res = await productService.getProductById(productId)
    const vars = res.data.variants || []

    setProduct(res.data)
    setVariants(vars)

    if (!vars.length) return

    // ✅ 1️⃣ pick first available SIZE
    const firstAvailable = vars.find(v => v.stock > 0)
    if (!firstAvailable) return

    setSelectedSize(firstAvailable.size)
    setSelectedFlavor(firstAvailable.flavor)
    setSelectedVariant(firstAvailable)
  }

  fetchProduct()
}, [open, productId])


useEffect(() => {
  if (!selectedSize || !selectedFlavor) return

  const match = variants.find(
    v =>
      v.size === selectedSize &&
      v.flavor === selectedFlavor &&
      v.stock > 0
  )

  setSelectedVariant(match || null)
}, [selectedSize, selectedFlavor, variants])



const sizes = [...new Set(variants.map(v => v.size))]

const flavors = [
  ...new Set(
    variants
      .filter(v => v.size === selectedSize)
      .map(v => v.flavor)
  ),
]


const handleAddToCart = async () => {
  if (!selectedVariant) return

  if (!isAuthenticated) {
    navigate("/login")
    return
  }

  try {
    // ✅ backend call
    await cartService.addToCart({
      productId: product._id,
      variantId: selectedVariant._id,
      quantity: 1,
    })

    // ✅ redux sync
    dispatch(
      addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        productName: product.name,
        flavor: selectedVariant.flavor,
        size: selectedVariant.size,
        price: selectedVariant.price,
        quantity: 1,
      })
    )

    onClose()
  } catch (error) {
    alert(
      "Failed to add to cart: " +
        (error.response?.data?.message || error.message)
    )
  }
}



if (!open) return null

return createPortal(
  <>
  <div className="drawer-handle" />

    {/* Overlay */}
    <div className={`drawer-overlay ${open ? "show" : ""}`} onClick={onClose} />

<div className={`drawer ${open ? "open" : ""}`}>
  <button className="close-btn" onClick={onClose}>×</button>

      {product && (
        <>
          <img load="lazy"
            src={getImageUrl(selectedVariant?.images?.[0]) || getImageUrl(product.images?.[0] || "/placeholder.svg")}
            alt={product.name}
            className="drawer-image"
          />

          <h3>{product.name}</h3>
          <p className="price">₹{selectedVariant?.price}</p>

          {/* SIZE */}
       <div className="options">
  <h4>Pack Size</h4>
  {sizes.map(size => (
   <button
  key={size}
  className={`option-btn ${
    selectedSize === size ? "active" : ""
  }`}
  onClick={() => setSelectedSize(size)}
>
  {size}
</button>

  ))}
</div>


          {/* FLAVOR */}
        <div className="options">
  <h4>Flavor</h4>
  {flavors.map(flavor => {
    const disabled = !variants.find(
      v =>
        v.size === selectedSize &&
        v.flavor === flavor &&
        v.stock > 0
    )

    return (
      <button
  key={flavor}
  disabled={disabled}
  className={`option-btn ${
    selectedFlavor === flavor ? "active" : ""
  } ${disabled ? "disabled" : ""}`}
  onClick={() => setSelectedFlavor(flavor)}
>
  {flavor}
</button>

    )
  })}
</div>



          <button
  className="btn-primary"
  disabled={!selectedVariant || selectedVariant.stock === 0}
  onClick={handleAddToCart}
>
  Add to Cart
</button>

        </>
      )}
    </div>
  </>,
  document.getElementById("drawer-root")
)


}
