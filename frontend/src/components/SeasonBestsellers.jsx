import { useEffect, useState } from "react"
import { productService } from "../services/productService"
import ProductDealCard from "./ProductDealCard"
import { useNavigate } from "react-router-dom"
import "../styles/SeasonBestsellers.css"
import ProductCard from "./ProductCard"


const TABS = [
  { label: "Steal Deals", value: "deals" },
  { label: "Proteins", value: "protein-powder" },
  { label: "Gainers", value: "mass-gainers" },
  { label: "Creatines", value: "creatine" },
  { label: "Pre-Workouts", value: "pre-workout" },
  { label: "Multivitamins", value: "multivitamins" },
  { label: "Aminos & BCAAs", value: "amino-bcaa" },
]


export default function SeasonBestsellers() {
  const [activeTab, setActiveTab] = useState("deals")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    fetchProductsByTab(activeTab)
  }, [activeTab])

  const fetchProductsByTab = async (tabKey) => {
    try {
      setLoading(true)

      let params = { limit: 10 }

      // 🔥 TAB → FILTER LOGIC
      if (tabKey === "deals") {
        params.isDeal = true          // backend: discounted products
      } else {
        params.categorySlug = tabKey     // backend: category slug
      }

      const res = await productService.getAllProducts(params)
      setProducts(res.data.products || [])
    } catch (err) {
      console.error("Failed to load products", err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="season-section">
      <h2 className="season-title">Season&apos;s Bestsellers!!</h2>

      {/* 🔘 Tabs */}
      <div className="season-tabs">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`season-tab ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🛒 Carousel */}
      <div className="season-carousel">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>
      <div className="view-all-wrapper">
  <button
    className="view-all-btn"
    onClick={() => navigate("/categories")}
  >
    VIEW ALL
  </button>
</div>
    </section>
  )
}