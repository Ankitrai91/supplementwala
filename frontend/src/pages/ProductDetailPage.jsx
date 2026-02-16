"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { productService } from "../services/productService"
import { cartService } from "../services/cartService"
import { addToCart } from "../store/slices/cartSlice"
import "./ProductDetailPage.css"
import { getImageUrl } from "../utils/imageUrl"
import ProductCard from "../components/ProductCard"

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const { items: cartItems } = useSelector(state => state.cart)
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedFlavor, setSelectedFlavor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [activeImage, setActiveImage] = useState(null)
const [isZoomed, setIsZoomed] = useState(false)
const [touchStartX, setTouchStartX] = useState(null)
const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
const [isZooming, setIsZooming] = useState(false)
const [imgLoading, setImgLoading] = useState(true)
const [openSection, setOpenSection] = useState(null)
const [relatedProducts, setRelatedProducts] = useState([])


const toggleSection = (key) => {
  setOpenSection(prev => (prev === key ? null : key))
}




  useEffect(() => {
  if (!variants.length) return

  let matchedVariant = variants.find(v => {
    if (selectedFlavor && v.flavor !== selectedFlavor) return false
    if (selectedSize && v.size !== selectedSize) return false
    return true
  })

  // fallback to first available variant
  if (!matchedVariant) {
    matchedVariant = variants[0]
  }

  setSelectedVariant(matchedVariant)
}, [selectedFlavor, selectedSize, variants])


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productService.getProductById(id)
        setProduct(response.data)
        setVariants(response.data.variants || [])
       if (response.data.variants?.length > 0) {
  const first = response.data.variants[0]
  setSelectedFlavor(first.flavor || null)
  setSelectedSize(first.size || null)
  setSelectedVariant(first)
}

      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

useEffect(() => {
  if (galleryImages.length > 0) {
    setActiveImage(galleryImages[0])
    setImgLoading(true)
  }
}, [selectedVariant, product])

useEffect(() => {
  const fetchRelated = async () => {
    try {
      const res = await productService.getRelatedProducts(id)
      setRelatedProducts(res.data.products || [])
    } catch (err) {
      console.log("Related products error", err)
    }
  }

  if (id) fetchRelated()
}, [id])




// 🔥 UNIVERSAL PRICE SOURCE (Flipkart Logic)
const sellingPrice = product?.hasVariants
  ? selectedVariant?.price
  : product?.price

const mrpPrice = product?.hasVariants
  ? selectedVariant?.mrp
  : product?.mrp

// 🔥 DISCOUNT %
const discountPercent =
  mrpPrice && sellingPrice
    ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
    : 0






  const isFlavorAvailable = (flavor) => {
  return variants.some(
    (v) =>
      v.flavor === flavor &&
      v.stock > 0 &&
      v.isActive !== false
  )
}

const isSizeAvailable = (size) => {
  return variants.some(
    (v) =>
      v.size === size &&
      (!selectedFlavor || v.flavor === selectedFlavor) &&
      v.stock > 0 &&
      v.isActive !== false
  )
}

const handleTouchStart = (e) => {
  setTouchStartX(e.touches[0].clientX)
}

const handleTouchEnd = (e) => {
  if (!touchStartX) return

  const diff = e.changedTouches[0].clientX - touchStartX

  if (Math.abs(diff) < 50) return

  const currentIndex = galleryImages.indexOf(activeImage)

  if (diff < 0 && currentIndex < galleryImages.length - 1) {
    setActiveImage(galleryImages[currentIndex + 1])
  }

  if (diff > 0 && currentIndex > 0) {
    setActiveImage(galleryImages[currentIndex - 1])
  }

  setTouchStartX(null)
}


  const filteredVariants = variants.filter((v) => {
    if (selectedFlavor && v.flavor !== selectedFlavor) return false
    if (selectedSize && v.size !== selectedSize) return false
    return true
  })

  const flavors = [...new Set(variants.map((v) => v.flavor).filter(Boolean))]
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]

  const supercashReward = product && selectedVariant ? (selectedVariant.price * product.supercashPercent) / 100 : 0


  const galleryImages =
  selectedVariant?.images?.length > 0
    ? selectedVariant.images
    : product?.images?.length > 0
    ? product.images
    : product?.thumbnail
    ? [product.thumbnail]
    : []

    
    useEffect(() => {
  if (!galleryImages?.length) return

  galleryImages.forEach((img) => {
    const preload = new Image()
    preload.src = getImageUrl(img)
  })
}, [galleryImages])



    const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()

  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100

  setZoomPos({ x, y })
}



    
//   const handleAddToCart = async () => {
//     if (!selectedVariant) {
//       alert("Please select a variant")
//       return
//     }

//     if (!isAuthenticated) {
//       navigate("/login")
//       return
//     }

//     try {
//       const cartItem = {
//         variantId: selectedVariant._id,
//         quantity,
//       }
//       console.log("Adding to cart:", cartItem)
//       // const response = await cartService.addToCart(cartItem.variantId, cartItem.quantity)

//       const response = await cartService.addToCart({
//   productId: product._id,
//   variantId: selectedVariant._id,
//   quantity,
// })

      
//       // Add to Redux store
//       dispatch(addToCart({
//         variantId: selectedVariant._id,
//         productId: product._id,
//         productName: product.name,
//         flavor: selectedVariant.flavor,
//         size: selectedVariant.size,
//         price: selectedVariant.price,
//         quantity,
//       }))
      
//       alert("Added to cart!")
//       setQuantity(1)
//     } catch (error) {
//       alert("Failed to add to cart: " + (error.response?.data?.message || error.message))
//     }
//   }


 const handleAddToCart = async () => {

  if (!isAuthenticated) {
    navigate("/login")
    return
  }

  try {

    let cartPayload = {}
    let reduxPayload = {}

    // 🟢 CASE 1 — PRODUCT HAS VARIANTS
    if (product.hasVariants) {

      if (!selectedVariant) {
        alert("Please select a variant")
        return
      }

      cartPayload = {
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
      }

      reduxPayload = {
        productId: product._id,
        variantId: selectedVariant._id,
        productName: product.name,
        flavor: selectedVariant.flavor,
        size: selectedVariant.size,
        price: selectedVariant.price,
        quantity,
      }
    }

    // 🟢 CASE 2 — SIMPLE PRODUCT (NO VARIANT)
    else {

      cartPayload = {
        productId: product._id,
        quantity,
      }

      reduxPayload = {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity,
      }
    }

    console.log("Adding to cart:", cartPayload)

    await cartService.addToCart(cartPayload)

    dispatch(addToCart(reduxPayload))

    alert("Added to cart!")
    setQuantity(1)

  } catch (error) {
    alert(
      "Failed to add to cart: " +
      (error.response?.data?.message || error.message)
    )
  }
}

  if (loading) return <div className="loading">Loading product...</div>
  if (error) return <div className="error">{error}</div>
  if (!product) return <div className="error">Product not found</div>

  return (
    <>
    <div className="product-detail-page">
      <div className="container">
        <Link to="/" className="back-link">
          ← Back to Products
        </Link>

        <div className="product-detail">
     <div className="product-gallery-wrapper">

  {/* MAIN IMAGE */}
  <div
  className="product-gallery"
  onMouseEnter={() => setIsZooming(true)}
  onMouseLeave={() => setIsZooming(false)}
  onMouseMove={handleMouseMove}
>
  <div
    className="zoom-lens"
    style={{
      backgroundImage: `url(${getImageUrl(activeImage)})`,
      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
      opacity: isZooming ? 1 : 0,
    }}
  />

{imgLoading && <div className="image-skeleton" />}

  <img
    key={activeImage}
    loading="lazy"
    src={getImageUrl(activeImage)}
    alt={product.name}
    className={`main-image ${imgLoading ? "hidden" : ""}`}
    onLoad={() => setImgLoading(false)}
  />
</div>


  {/* THUMBNAILS */}
  {galleryImages.length > 1 && (
    <div className="thumbnail-gallery">
      {galleryImages.map((img, index) => (
        <img
        key={index}
        loading="lazy"
        src={getImageUrl(img)}
        alt={`${product.name}-${index}`}
          className={`thumbnail ${
            activeImage === img ? "active" : ""
          }`}
          onClick={() => setActiveImage(img)}
          />
      ))}
    </div>
  )}
</div>




          <div className="product-details">
            <h1>{product.name}</h1>

            {product.brand && <p className="brand">{product.brand.name}</p>}

            <div className="rating-section">
              <span className="rating">4.5 ★</span>
            </div>

            <div className="price-wrapper">
              {/* <span className="current-price">₹{selectedVariant?.price || "N/A"}</span>
              {selectedVariant?.mrp && <span className="original-price">₹{selectedVariant.mrp}</span>} */}
              <div className="price-main">
    {sellingPrice && (
      <span className="selling-price">₹{sellingPrice}</span>
    )}

    {mrpPrice && mrpPrice > sellingPrice && (
      <span className="mrp-price">₹{mrpPrice}</span>
    )}

    {discountPercent > 0 && (
      <span className="discount-badge">
        {discountPercent}% OFF
      </span>
    )}
  </div>
            </div>

            {supercashReward > 0 && user && (
              <div className="supercash-badge">
                <span>★</span> Earn ₹{Math.round(supercashReward)} Supercash on this purchase!
              </div>
            )}

            <div className="variant-selectors">
              {flavors.length > 0 && (
                <div className="selector-group">
                  <label>Flavor</label>
                  <div className="options">
                  {flavors.map((flavor) => {
                    const disabled = !isFlavorAvailable(flavor)
                    
                    return (
                      <button
                      key={flavor}
                      className={`option-btn 
                        ${selectedFlavor === flavor ? "active" : ""}
                        ${disabled ? "disabled" : ""}
                        `}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return
                          setSelectedFlavor(flavor)
                          setSelectedSize(null)
                        }}
                        >
      {flavor}
    </button>
  )
})}

                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="selector-group">
                  <label>Size</label>
                  <div className="options">
                  {sizes.map((size) => {
                    const disabled = !isSizeAvailable(size)
                    
                    return (
                      <button
                      key={size}
                      className={`option-btn 
                        ${selectedSize === size ? "active" : ""}
                        ${disabled ? "disabled" : ""}
                        `}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return
                          setSelectedSize(size)
                        }}
                        >
      {size}
    </button>
  )
})}

                  </div>
                </div>
              )}
            </div>

            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>


            {product.benefits && product.benefits.length > 0 && (
              <div className="product-benefits">
                <h3>Key Benefits</h3>
                <ul>
                  {product.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}


            {/* 🚚 SHIPPING & DELIVERY */}
<div className="shipping-box">

  <h3 className="shipping-title">🚚 Shipping & Delivery</h3>

  {/* PINCODE */}
  <div className="pincode-row">
    <input
      type="text"
      value="273001"
      readOnly
      className="pincode-input"
      />
    <button className="change-btn">CHANGE</button>
  </div>

  {/* DELIVERY INFO */}
  <p className="delivery-text">
    Estimated delivery between <b>Mon, 16th Feb</b> to <b>Wed, 18th Feb</b>
  </p>

  {/* BADGES */}
  <div className="shipping-features">
    <span>💰 Cash on delivery available</span>
    <span>🔁 7 Days Exchange / Return Policy</span>
  </div>

</div>

            {/* 🔥 PRODUCT INFO ACCORDION */}
<div className="product-info-accordion">

  {/* DESCRIPTION */}
  {product.description && (
    <div className={`info-item ${openSection === "desc" ? "open" : ""}`}>
      <div
        className="info-header"
        onClick={() => toggleSection("desc")}
        >
        <span>📝 Description</span>
        <span className="arrow">{openSection === "desc" ? "−" : "+"}</span>
      </div>

      {openSection === "desc" && (
        <div className="info-content">
          <p>{product.description}</p>
        </div>
      )}
    </div>
  )}

  {/* INGREDIENTS */}
  {product.ingredients && (
    <div className={`info-item ${openSection === "ing" ? "open" : ""}`}>
      <div
        className="info-header"
        onClick={() => toggleSection("ing")}
        >
        <span>🥗 Ingredients</span>
        <span className="arrow">{openSection === "ing" ? "−" : "+"}</span>
      </div>

      {openSection === "ing" && (
        <div className="info-content">
          <p>{product.ingredients}</p>
        </div>
      )}
    </div>
  )}

  {/* ADDITIONAL INFO */}
  {product.additionalInfo && (
    <div className={`info-item ${openSection === "add" ? "open" : ""}`}>
      <div
        className="info-header"
        onClick={() => toggleSection("add")}
        >
        <span>ℹ️ Additional Information</span>
        <span className="arrow">{openSection === "add" ? "−" : "+"}</span>
      </div>

      {openSection === "add" && (
        <div className="info-content">
          <p>{product.additionalInfo}</p>
        </div>
      )}
    </div>
  )}
  
    <div className={`info-item ${openSection === "re" ? "open" : ""}`}>
      <div
        className="info-header"
        onClick={() => toggleSection("re")}
        >
        <span>🔁 Return Policy</span>
        <span className="arrow">{openSection === "re" ? "−" : "+"}</span>
      </div>

      {openSection === "re" && (
        <div className="info-content">
          <p>7 Day Return Policy We offer you complete peace of mind while ordering at Nutristar- you can return or replace all items within 7 days of receiving the goods. To be eligible for it, your item must be unused, unopened and product packaging should be intact as you received. Please Note: For all claims related to receiving a damaged or wrong product, we advise you to share a video evidence of unboxing and the issue. We may not be able to entertain claims of a damaged product being received without a video proof at the time of unboxing. Requests arising for change of mind, wrong flavour selection, or accidental ordering do not qualify under our return policy.</p>
        </div>
      )}
    </div>

</div>


          </div>
        </div>
      </div>
    </div>

    
    {/* RELATED PRODUCTS */}
{relatedProducts.length > 0 && (
  <div className="related-products-section">
    <h2 className="related-title">
      Explore The Full Range
    </h2>

    <div className="related-products-grid">
      {relatedProducts.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          variants={product.variants}
        />
      ))}
    </div>
  </div>
)}

      </>
  )
}

export default ProductDetailPage
