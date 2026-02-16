import React, { useState } from "react"
import "/src/styles/ShopFilters.css"

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <strong>{title}</strong>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && <div className="filter-body">{children}</div>}
    </div>
  )
}

function ShopFilters({ brands, filters, setFilters, selectedBrands, onToggleBrand }) {
  const toggleValue = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }




const toggleBrand = (brandId) => {
  setFilters(prev => ({
    ...prev,
    brand: prev?.brand.includes(brandId)
      ? prev.brand.filter(id => id !== brandId) // ❌ remove
      : [...prev.brand, brandId],                // ✅ add
  }))
}


  return (
    <aside className="shop-filters">

      {/* BRAND */}
 <FilterSection title="Brand">
       {brands.map(brand => (
        <label key={brand._id} className="filter-item">
          <input
            type="checkbox"
            checked={selectedBrands.includes(brand._id)}
            onChange={() => onToggleBrand(brand._id)}
          />
          {brand.name}
        </label>
      ))}
      </FilterSection>


      {/* PRICE */}
      <FilterSection title="Price">
        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={filters.maxPrice}
          onChange={e =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
        />
        <p>Up to ₹{filters.maxPrice}</p>
      </FilterSection>

      {/* DISCOUNT */}
      <FilterSection title="Discount">
        {[10, 20, 30, 40, 50, 60].map(d => (
          <label key={d}>
            <input
              type="radio"
              name="discount"
              checked={filters.discount === d}
              onChange={() =>
                setFilters({ ...filters, discount: d })
              }
            />
            {d}% or more
          </label>
        ))}
      </FilterSection>

      {/* WEIGHT */}
      <FilterSection title="Weight / Quantity">
        {["122gm", "250gm", "500gm", "1kg"].map(size => (
          <label key={size}>
            <input
              type="checkbox"
              checked={filters.sizes.includes(size)}
              onChange={() => toggleValue("sizes", size)}
            />
            {size}
          </label>
        ))}
      </FilterSection>

      {/* FLAVOUR */}
      <FilterSection title="Flavour">
        {["Chocolate", "Vanilla", "Fruit Fusion"].map(f => (
          <label key={f}>
            <input
              type="checkbox"
              checked={filters.flavors.includes(f)}
              onChange={() => toggleValue("flavors", f)}
            />
            {f}
          </label>
        ))}
      </FilterSection>

      {/* CONCERN */}
      <FilterSection title="Concern">
        {["Muscle Recovery", "Energy", "Fat Loss"].map(c => (
          <label key={c}>
            <input
              type="checkbox"
              checked={filters.concerns.includes(c)}
              onChange={() => toggleValue("concerns", c)}
            />
            {c}
          </label>
        ))}
      </FilterSection>

    </aside>
  )
}

export default React.memo(ShopFilters)
