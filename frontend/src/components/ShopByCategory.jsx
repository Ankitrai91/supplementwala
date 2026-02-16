import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import "/src/styles/ShopByCategory.css"
import { getImageUrl } from "../utils/imageUrl"

export default function ShopByCategory() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosClient.get("/categories")
      setCategories(res.data || [])
    }

    fetchCategories()
  }, [])

  const navigate = useNavigate()

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories?category=${categoryId}`)
  }
  return (
    <section className="shop-category-section">
      <h2>Shop By Category</h2>

      <div className="category-grid">
        {categories.slice(0,12).map((cat) => (
          <div
            key={cat._id}
            className="category-card"
            onClick={() => handleCategoryClick(cat._id)}
          >
            <img load="lazy" src={getImageUrl(cat.cardImage)} alt={cat.name} />
            <h3>{cat.name}</h3>
            <p>{cat.discountText}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
