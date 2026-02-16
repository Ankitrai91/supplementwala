'use client';

import { useState, useEffect } from 'react'
import { brandService, productService } from '../services/productService'
import  ProductCard  from '../components/ProductCard'
import './BrandsPage.css'
import { useParams } from "react-router-dom"
import { getImageUrl } from '../utils/imageUrl';



function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { slug } = useParams()


  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)

      const response = await brandService.getAllBrands()
      const brandList = response.data
      setBrands(brandList)

      // ✅ If coming from /brand/:slug
      if (slug) {
        const matchedBrand = brandList.find((b) => b.slug === slug)

        if (matchedBrand) {
          setSelectedBrand(matchedBrand._id)
          fetchProductsByBrand(matchedBrand._id)
          return
        }
      }

      // ✅ Default: All brands
      setSelectedBrand(null)
      fetchProductsByBrand(null)

    } catch (error) {
      console.error("Failed to fetch brands:", error)
    } finally {
      setLoading(false)
    }
  }


  const fetchProductsByBrand = async (brandId) => {
    try {
      const params = { limit: 20 }
      if (brandId) params.brand = brandId

      const response = await productService.getAllProducts(params)
      setProducts(response.data.products)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId)
    fetchProductsByBrand(brandId)
  }

  const activeBrand = brands.find((b) => b._id === selectedBrand)


  if (loading) return <div className="loading">Loading brands...</div>

  return (
    <div className="brands-page">

     

      {/* <div className="brands-hero">
        <h1>Our Brands</h1>
        <p>Explore premium nutrition brands from around the world</p>
      </div> */}
       {activeBrand?.bannerImage && (
  <div className="brand-banner">
    <img load="lazy"
      src={getImageUrl(activeBrand.bannerImage)}
      alt={activeBrand.name}
    />
  </div>
)}

      <div className="brands-container">
        <aside className="brands-sidebar">
          <h2>Select Brand</h2>
          <div className="brands-list">
            <button
              className={`brand-btn ${selectedBrand === null ? "active" : ""}`}
              onClick={() => handleBrandSelect(null)}
            >
              <span>All Brands</span>
            </button>

            {brands.map(brand => (
              <button
                key={brand._id}
                className={`brand-btn ${selectedBrand === brand._id ? 'active' : ''}`}
                onClick={() => handleBrandSelect(brand._id)}
              >
                <img load="lazy"
                  src={getImageUrl(brand.cardImage || brand.logo)}
                  alt={brand.name}
                />
                <span>{brand.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="brands-content">
          <div className="selected-brand-info">
            {activeBrand && (
              <>
                <h2>{activeBrand.name}</h2>
                <p>{activeBrand.description || "Premium quality nutrition products"}</p>
              </>
            )}

          </div>

          <div className="products-grid">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} variants={product.variants} />
              ))
            ) : (
              <p className="no-products">No products found for this brand</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default BrandsPage
