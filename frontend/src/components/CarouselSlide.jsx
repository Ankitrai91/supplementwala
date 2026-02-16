import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./CarouselSlide.css"

const banners = [
  {
    id: 1,
    image:
      "https://ussupplements.in/wp-content/uploads/2022/08/Banner-Us-Supplements.png",
    link: "/shop",
  },
  {
    id: 2,
    image:
      "https://ussupplements.in/wp-content/uploads/2022/08/US-Supplements.jpg",
    link: "/brands",
  },
  {
    id: 3,
    image:
           "https://ussupplements.in/wp-content/uploads/2022/08/Banner-Us-Supplements.png",

    link: "/offers",
  },
]

export default function CarouselSlide() {
  const navigate = useNavigate()
  const trackRef = useRef(null)

  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto slide
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Swipe support
  const startX = useRef(0)

  const onTouchStart = e => {
    setIsPaused(true)
    startX.current = e.touches[0].clientX
  }

  const onTouchEnd = e => {
    const diff = startX.current - e.changedTouches[0].clientX

    if (diff > 50) {
      setIndex(prev => (prev + 1) % banners.length)
    } else if (diff < -50) {
      setIndex(prev =>
        prev === 0 ? banners.length - 1 : prev - 1
      )
    }

    setIsPaused(false)
  }

  return (
    <section
      className="carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="carousel-track"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {banners.map(banner => (
          <div
            key={banner.id}
            className="carousel-slide"
            onClick={() => navigate(banner.link)}
          >
            <img src={banner.image} alt="Banner" />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="carousel-dots">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`dot ${index === i ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
