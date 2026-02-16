"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { categoryService, productService } from "../services/productService"
import ProductCard  from "../components/ProductCard"
import "./CategoriesPage.css"

function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get("category")

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories()
        setCategories(response.data)
      } catch (err) {
        console.error("[v0] Failed to fetch categories:", err)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = {
          page,
          limit: 12,
          sort: sortBy,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
        }

        if (selectedCategory) {
          params.category = selectedCategory
        }

        console.log("[v0] Fetching products with params:", params)
        const response = await productService.getAllProducts(params)
        console.log("[v0] Products fetched:", response.data)
        setProducts(response.data.products || [])
        setTotalPages(response.data.pagination?.pages || 1)
      } catch (err) {
        console.error("[v0] Failed to fetch products:", err)
        setError(err.response?.data?.error || "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, selectedCategory, sortBy, priceRange])

  const handleCategoryClick = (categoryId) => {
    setPage(1)
    setSearchParams({ category: categoryId })
  }

  const handleCategoryReset = () => {
    setPage(1)
    setSearchParams({})
  }

  const selectedCategoryName = categories.find((c) => c._id === selectedCategory)?.name || "All Products"

  return (
    <div className="categories-page">
      <div className="categories-container">
        {/* Sidebar */}
        <aside className="categories-sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            <div className="category-list">
              <button
                className={`category-item ${!selectedCategory ? "active" : ""}`}
                onClick={handleCategoryReset}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  className={`category-item ${selectedCategory === category._id ? "active" : ""}`}
                  onClick={() => handleCategoryClick(category._id)}
                >
                  {category.name}
                  <span className="category-count">{category.productCount || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Price Range</h3>
            <div className="price-filter">
              <div className="price-input">
                <label>Min Price</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="price-input">
                <label>Max Price</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  max="100000"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="categories-main">
          <div className="categories-header">
            <h1>{selectedCategoryName}</h1>
            <div className="sort-controls">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading && <div className="loading">Loading products...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && products.length === 0 && (
            <div className="no-products">
              <p>No products found in this category</p>
              <Link to="/" className="back-link">
                Back to Home
              </Link>
            </div>
          )}

          {!loading && products.length > 0 && (
            <>
              <div className="products-grid">
                {products.map((product) => (
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
                    <button onClick={() => setPage(page - 1)} className="pagination-btn">
                      Previous
                    </button>
                  )}

                  <span className="page-info">
                    Page {page} of {totalPages}
                  </span>

                  {page < totalPages && (
                    <button onClick={() => setPage(page + 1)} className="pagination-btn">
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default CategoriesPage
