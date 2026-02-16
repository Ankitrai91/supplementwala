"use client"

import { useState, useEffect, useCallback } from "react"
import { productService } from "../services/productService"
import ProductCard from "../components/ProductCard"
import ShopFilters from "../components/ShopFilters"
// import "./HomePage.css"
import axiosClient from "../api/axiosClient"
import "./Shop.css"

function HomePage() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedBrands, setSelectedBrands] = useState([])
const [filterOpen, setFilterOpen] = useState(false)


  const [filters, setFilters] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: 5000,
    discount: null,
    sizes: [],
    flavors: [],
    concerns: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const params = {
          page,
          limit: 12,
          maxPrice: filters.maxPrice,
        }

      if (selectedBrands.length) {
        params.brand = selectedBrands.join(",")
      }

        if (filters.discount)
          params.discount = filters.discount

        if (filters.sizes.length)
          params.size = filters.sizes.join(",")

        if (filters.flavors.length)
          params.flavor = filters.flavors.join(",")

        if (filters.concerns.length)
          params.benefit = filters.concerns.join(",")

        const res = await productService.getAllProducts(params)
        setProducts(res.data.products)
        setTotalPages(res.data.pagination.pages)
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, filters,selectedBrands])

  useEffect(() => {
  const fetchBrands = async () => {
    const res = await axiosClient.get("/brands")
    setBrands(res.data)
  }

  fetchBrands()
}, [])

const toggleBrand = useCallback((brandId) => {
  setPage(1)

  setSelectedBrands(prev =>
    prev.includes(brandId)
      ? prev.filter(id => id !== brandId)
      : [...prev, brandId]
  )
}, [])



  if (loading) return <div className="loading">Loading products...</div>
  if (error) return <div className="error">{error}</div>

 return (
  <div className="container shop-layout">

    {/* 📱 MOBILE FILTER BUTTON */}
    <div className="mobile-filter-bar">
      <button onClick={() => setFilterOpen(true)}>
        ☰ Filters
      </button>
    </div>

    {/* 💻 DESKTOP FILTER */}
    <div className="desktop-filter">
      <ShopFilters
        brands={brands}
        filters={filters}
        setFilters={setFilters}
        selectedBrands={selectedBrands}
        onToggleBrand={toggleBrand}
      />
    </div>

    {/* 📱 MOBILE DRAWER */}
   {/* 📱 MOBILE FILTER DRAWER */}
 <div
  className={`filter-overlay ${filterOpen ? "open" : ""}`}
  onClick={() => setFilterOpen(false)}
>
    <div
      className="mobile-filter-sheet"
      onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
    >
      <div className="sheet-header">
        <h3>Filters</h3>
        <button onClick={() => setFilterOpen(false)}>✕</button>
      </div>

      <ShopFilters
        brands={brands}
        filters={filters}
        setFilters={setFilters}
        selectedBrands={selectedBrands}
        onToggleBrand={toggleBrand}
      />
    </div>
  </div>


    {/* PRODUCTS */}
    <div className="products-section">
      <h2>All Products</h2>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            variants={product.variants}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)}>Previous</button>
          )}
          <span>Page {page} of {totalPages}</span>
          {page < totalPages && (
            <button onClick={() => setPage(page + 1)}>Next</button>
          )}
        </div>
      )}
    </div>

  </div>
)

}

export default HomePage
