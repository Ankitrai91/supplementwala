import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { brandService } from "../services/productService"
// import { getImageUrl } from "../utils/getImageUrl"
import "/src/styles/BrandCarousel.css"
import { getImageUrl } from "../utils/imageUrl"

export default function BrandCarousel() {
  const [brands, setBrands] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await brandService.getAllBrands()
      setBrands(res.data)
    }
    fetchBrands()
  }, [])

  return (
    <section className="brand-carousel-section">
      <h2 className="brand-carousel-title">
        Celebrations, The Premium Way
      </h2>

      <div className="brand-carousel-wrapper">
        <div className="brand-carousel-track">
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="brand-card"
              onClick={() => navigate(`/brand/${brand.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="brand-glow"></div>

              <img load="lazy"
                src={getImageUrl(brand.cardImage || brand.logo)}
                alt={brand.name}
                className="brand-image"
              />

              <div className="brand-name">
                {brand.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
