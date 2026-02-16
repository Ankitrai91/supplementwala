'use client';

import { useState, useEffect } from 'react'
import '../pages/CategoriesPage.css'
import axiosClient from '../api/axiosClient'

export default function MegaMenu() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState({})
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching categories for megamenu")
        const response = await axiosClient.get('/categories')
        console.log("[v0] Categories fetched:", response.data)
        setCategories(response.data.data || response.data)
        setMenuItems(response.data.data || response.data)
      } catch (error) {
        console.error('[v0] Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="mega-menu">
      <div className="mega-menu-content">
        {loading ? (
          <div className="mega-menu-loader">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="mega-menu-empty">No categories available</div>
        ) : (
          <div className="category-list">
            {categories.map((category) => (
              <div key={category._id} className="mega-menu-item">
                <a href={`/categories?category=${category.slug}`} className="category-link">
                  {category.name}
                </a>
                <p className="category-count">({category.productCount || 0} products)</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
