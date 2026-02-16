'use client';
import { clearAuth } from "../store/slices/authSlice"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import '../styles/AdminDashboard.css'
import ImagePreviewGrid from "../components/ImagePreviewGrid";

export default function AdminDashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [imageFiles, setImageFiles] = useState([])


  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login')
      return
    }

    fetchStats()
  }, [isAuthenticated, user])

  const handleAdminLogout = () => {
  dispatch(clearAuth())
  navigate("/login")
}


  const fetchStats = async () => {
    try {
      setLoading(true)
      console.log('[v0] Fetching admin stats...')
      const response = await axiosClient.get('/admin/orders-stats')
      console.log('[v0] Stats received:', response.data)
      setStats(response.data)
      setError(null)
    } catch (err) {
      console.error('[v0] Failed to fetch stats:', err)
      setError(err.response?.data?.message || 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  if (user?.role !== 'admin') {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You do not have admin privileges. Only administrators can access this panel.</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h1>Admin Panel</h1>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            📦 Products
          </button>
          <button
            className={`nav-item ${activeSection === 'variants' ? 'active' : ''}`}
            onClick={() => setActiveSection('variants')}
          >
            🎯 Variants
          </button>
          <button
            className={`nav-item ${activeSection === 'brands' ? 'active' : ''}`}
            onClick={() => setActiveSection('brands')}
          >
            🏷️ Brands
          </button>
          <button
            className={`nav-item ${activeSection === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveSection('categories')}
          >
            📂 Categories
          </button>
          <button
            className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            🛒 Orders
          </button>
          <button
            className={`nav-item ${activeSection === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveSection('menu')}
          >
            🍔 Menu
          </button>

          <div className="admin-logout">
  <button className="nav-item logout" onClick={handleAdminLogout}>
    🚪 Logout
  </button>
</div>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h2>Welcome, {user?.firstName || 'Admin'}!</h2>
          <p>Manage your e-commerce platform</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {activeSection === 'overview' && (
          <div className="admin-overview">
            {loading ? (
              <p>Loading statistics...</p>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === 'products' && <AdminProducts />}
        {activeSection === 'variants' && <AdminVariants />}
        {activeSection === 'brands' && <AdminBrands />}
        {activeSection === 'categories' && <AdminCategories />}
        {activeSection === 'orders' && <AdminOrders />}
        {activeSection === 'menu' && <AdminMenu />}
      </div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState([])
const [categories, setCategories] = useState([])
// const [imageFiles, setImageFiles] = useState([])
const [benefitInput, setBenefitInput] = useState("")
const [imagePreviews, setImagePreviews] = useState([])

const [images, setImages] = useState([])


  const [newProduct, setNewProduct] = useState({
    name: '',
    categoryId: '',
    category: '',   // ✅ FIXED
    brand: '',
    description: "",
  ingredients: "",
  additionalInfo: "",
  benefits: [],
    supercashPercent: 5,
    hasVariants: false,
    variantTypes: [],
    price: '',
    mrp: '',
    stock: '',
    
  })

useEffect(() => {
  fetchProducts()
  fetchMeta()
}, [])

const fetchMeta = async () => {
  const [brandsRes, categoriesRes] = await Promise.all([
    axiosClient.get("/brands"),
    axiosClient.get("/categories"),
  ])

  setBrands(brandsRes.data)
  setCategories(categoriesRes.data)
}


const moveUp = (index) => {
  if (index === 0) return

  const newFiles = [...imageFiles]
  ;[newFiles[index - 1], newFiles[index]] =
    [newFiles[index], newFiles[index - 1]]

  setImageFiles(newFiles)
}

const moveDown = (index) => {
  if (index === imageFiles.length - 1) return

  const newFiles = [...imageFiles]
  ;[newFiles[index + 1], newFiles[index]] =
    [newFiles[index], newFiles[index + 1]]

  setImageFiles(newFiles)
}


  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/products')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

 const handleCreateProduct = async (e) => {

  e.preventDefault()

  try {
    const formData = new FormData()

    Object.entries(newProduct).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, value)
      }
    })

   // ✅ ALWAYS append product images (variant or not)
images.forEach(img => {
  formData.append("images", img.file)
})


console.log('[v0] Creating product with data:', newProduct)
const response = await axiosClient.post(
      "/admin/products",
      formData
    )

    alert("Product created successfully!")
  } catch (error) {
  console.log("CREATE PRODUCT ERROR:", error) // ⭐ ADD THIS

    alert(error.response?.data?.error || "Failed to create product")
  }
}


  return (
    <div className="admin-section">
      <h3>Manage Products</h3>
      <form onSubmit={handleCreateProduct} className="admin-form">

        <select
  value={newProduct.category}
  onChange={(e) =>
    setNewProduct({ ...newProduct, category: e.target.value })
  }
  required
>
  <option value="">Select Category</option>
  {categories.map((c) => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>

        <select
  value={newProduct.brand}
  onChange={(e) =>
    setNewProduct({ ...newProduct, brand: e.target.value })
  }
  required
>
  <option value="">Select Brand</option>
  {brands.map((b) => (
    <option key={b._id} value={b._id}>
      {b.name}
    </option>
  ))}
</select>


        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
       <textarea
  placeholder="Product Description"
  value={newProduct.description}
  onChange={(e) =>
    setNewProduct({ ...newProduct, description: e.target.value })
  }
/>




<textarea
  placeholder="Ingredients (e.g. Whey Protein Isolate, Cocoa Powder...)"
  value={newProduct.ingredients}
  onChange={(e) =>
    setNewProduct({ ...newProduct, ingredients: e.target.value })
  }
/>

<textarea
  placeholder="Additional Information (Usage, warnings, storage...)"
  value={newProduct.additionalInfo}
  onChange={(e) =>
    setNewProduct({ ...newProduct, additionalInfo: e.target.value })
  }
/>
<div className="benefits-section">
  <input
    type="text"
    placeholder="Add benefit (e.g. Improves muscle recovery)"
    value={benefitInput}
    onChange={(e) => setBenefitInput(e.target.value)}
  />

  <button
    type="button"
    onClick={() => {
      if (!benefitInput.trim()) return
      setNewProduct({
        ...newProduct,
        benefits: [...newProduct.benefits, benefitInput.trim()],
      })
      setBenefitInput("")
    }}
  >
    + Add Benefit
  </button>

  <ul>
    {newProduct.benefits.map((b, i) => (
      <li key={i}>
        {b}
        <span
          onClick={() =>
            setNewProduct({
              ...newProduct,
              benefits: newProduct.benefits.filter((_, idx) => idx !== i),
            })
          }
        >
          ❌
        </span>
      </li>
    ))}
  </ul>
</div>

{/* 🖼 Product Images (ALWAYS required) */}
<div className="image-upload">
  <label>Product Images</label>
 <input
  type="file"
  multiple
  accept="image/*"
 onChange={(e) => {
  const files = Array.from(e.target.files)

  const mapped = files.map(file => ({
    id: crypto.randomUUID(),
    file,
    src: URL.createObjectURL(file)
  }))

  setImages(prev => [...prev, ...mapped])
}}

/>
<ImagePreviewGrid images={images} setImages={setImages} />



  <small>
    Used on shop page, banners & fallback when variant images are missing
  </small>
</div>




        <input
          type="number"
          placeholder="Supercash Percent"
          value={newProduct.supercashPercent}
          onChange={(e) => setNewProduct({ ...newProduct, supercashPercent: parseFloat(e.target.value) })}
        />

        <label className="checkbox">
  <input
    type="checkbox"
    checked={newProduct.hasVariants}
    onChange={(e) =>
      setNewProduct({
        ...newProduct,
        hasVariants: e.target.checked,
        variantTypes: e.target.checked ? [] : [],
      })
    }
  />
  Product has variants?
</label>


{newProduct.hasVariants && (
  <div className="variant-types">
    <label>
      <input
        type="checkbox"
        value="flavor"
        checked={newProduct.variantTypes.includes("flavor")}
        onChange={(e) => {
          const value = e.target.value
          setNewProduct({
            ...newProduct,
            variantTypes: newProduct.variantTypes.includes(value)
              ? newProduct.variantTypes.filter(v => v !== value)
              : [...newProduct.variantTypes, value],
          })
        }}
      />
      Flavor
    </label>

    <label>
      <input
        type="checkbox"
        value="size"
        checked={newProduct.variantTypes.includes("size")}
        onChange={(e) => {
          const value = e.target.value
          setNewProduct({
            ...newProduct,
            variantTypes: newProduct.variantTypes.includes(value)
              ? newProduct.variantTypes.filter(v => v !== value)
              : [...newProduct.variantTypes, value],
          })
        }}
      />
      Size
    </label>
  </div>
)}

{!newProduct.hasVariants && (
  <>
  
  {/* <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => setImageFiles([...e.target.files])}
  /> */}


    <input
      type="number"
      placeholder="MRP"
      value={newProduct.mrp}
      onChange={(e) =>
        setNewProduct({ ...newProduct, mrp: e.target.value })
      }
      required
    />

    <input
      type="number"
      placeholder="Selling Price"
      value={newProduct.price}
      onChange={(e) =>
        setNewProduct({ ...newProduct, price: e.target.value })
      }
      required
    />
     <input
      type="number"
      placeholder="Stock Quantity"
      value={newProduct.stock}
      onChange={(e) =>
        setNewProduct({ ...newProduct, stock: e.target.value })
      }
      required
    />

    
  </>
)}

        <button type="submit" className="btn-submit">
          Create Product
        </button>
      </form>

      <div className="products-list">
        <h4>Existing Products ({products.length})</h4>
        {loading ? <p>Loading products...</p> : null}
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <strong>{product.name}</strong>
            <p>{product.description?.substring(0, 50)}...</p>
            <small>Category: {product.category?.name || 'N/A'}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminVariants() {
  const [variants, setVariants] = useState([])
  const [products, setProducts] = useState([])
  const [variantImages, setVariantImages] = useState([])
  

  const [newVariant, setNewVariant] = useState({
    productId: '',
    flavor: '',
    size: '',
    price: 0,
    stock: 0,
  })


  useEffect(() => {
  fetchProducts()
}, [])

const fetchProducts = async () => {
  const res = await axiosClient.get("/products")
  setProducts(res.data.products)
}

const handleCreateVariant = async (e) => {
  e.preventDefault()

  const formData = new FormData()
  Object.entries(newVariant).forEach(([key, value]) =>
    formData.append(key, value)
  )

  Array.from(variantImages).forEach((img) =>
    formData.append("images", img.file)
  )

  await axiosClient.post("/admin/variants", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  alert("Variant created successfully!")
}


  return (
    <div className="admin-section">
      <h3>Manage Variants</h3>
      <form onSubmit={handleCreateVariant} className="admin-form">
       <select
  value={newVariant.productId}
  onChange={(e) =>
    setNewVariant({ ...newVariant, productId: e.target.value })
  }
  required
>
  <option value="">Select Product</option>
  {products.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>

        <input
          type="text"
          placeholder="Flavor (e.g., Vanilla)"
          value={newVariant.flavor}
          onChange={(e) => setNewVariant({ ...newVariant, flavor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Size (e.g., 1kg)"
          value={newVariant.size}
          onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newVariant.price}
          onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) })}
          required
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={newVariant.stock}
          onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) })}
          required
        />
        <input
  type="file"
  multiple
  accept="image/*"
 onChange={(e) => {
  const files = Array.from(e.target.files)

  const mapped = files.map(file => ({
    id: crypto.randomUUID(),
    file,
    src: URL.createObjectURL(file)
  }))

  setVariantImages(prev => [...prev, ...mapped])
}}

/>
<ImagePreviewGrid
  images={variantImages}
  setImages={setVariantImages}
/>


        <button type="submit" className="btn-submit">
          Create Variant
        </button>
      </form>
    </div>
  )
}

function AdminBrands() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  })

  const [cardImage, setCardImage] = useState(null)
  const [bannerImage, setBannerImage] = useState(null)
  const [logoImage, setLogoImage] = useState(null)

  const handleCreateBrand = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("description", form.description)
    if (cardImage) formData.append("cardImage", cardImage)
    if (bannerImage) formData.append("bannerImage", bannerImage)
    if (logoImage) formData.append("logo", logoImage)

    try {
      await axiosClient.post("/admin/brands", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Brand created successfully!")
      setForm({ name: "", description: "" })
      setCardImage(null)
      setBannerImage(null)
    } catch (error) {
      alert("Failed: " + error.response?.data?.error)
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Brands</h3>

      <form onSubmit={handleCreateBrand} className="admin-form">
        <input
          type="text"
          placeholder="Brand Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>
          Card Image (500 × 666)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCardImage(e.target.files[0])}
            required
          />
        </label>

        <label>
          Banner Image (1200 × 415)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerImage(e.target.files[0])}
            required
          />
        </label>

        <button type="submit" className="btn-submit">
          Create Brand
        </button>
      </form>
    </div>
  )
}


function AdminCategories() {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    discountText: "",
    parent: "",
  })

  const [cardImage, setCardImage] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const handleCreateCategory = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      Object.entries(newCategory).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      if (cardImage) formData.append("cardImage", cardImage)
      if (coverImage) formData.append("coverImage", coverImage)

      await axiosClient.post("/admin/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      alert("Category created successfully!")
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create category")
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Categories</h3>

      <form onSubmit={handleCreateCategory} className="admin-form">
        <input
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />

        <input
          placeholder="Discount Text (e.g. UPTO 60% OFF)"
          value={newCategory.discountText}
          onChange={(e) =>
            setNewCategory({ ...newCategory, discountText: e.target.value })
          }
        />

        <label>Card Image (500 × 666)</label>
        <input type="file" accept="image/*" onChange={(e) => setCardImage(e.target.files[0])} />

        <label>Cover Image (1200 × 415)</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />

        <button className="btn-submit">Create Category</button>
      </form>
    </div>
  )
}


function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/admin/orders')
      setOrders(response.data.orders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log('[v0] Updating order status:', orderId, newStatus)
      const response = await axiosClient.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      })
      setOrders(orders.map((o) => (o._id === orderId ? response.data : o)))
      alert('Order status updated!')
    } catch (error) {
      alert('Failed to update order: ' + error.response?.data?.message)
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Orders</h3>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div>
                <strong>Order {order.orderNumber}</strong>
                <p>Total: ₹{order.total}</p>
                <p>Status: {order.status}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminMenu() {
  const [newMenuItem, setNewMenuItem] = useState({
    title: '',
    categoryId: '',
    icon: '',
    isMegaMenu: false,
    isFeatured: false,
  })

  const handleCreateMenuItem = async (e) => {
    e.preventDefault()
    try {
      console.log('[v0] Creating menu item:', newMenuItem)
      const response = await axiosClient.post('/api/menu', newMenuItem)
      alert('Menu item created successfully!')
      setNewMenuItem({
        title: '',
        categoryId: '',
        icon: '',
        isMegaMenu: false,
        isFeatured: false,
      })
    } catch (error) {
      alert('Failed to create menu item: ' + error.response?.data?.message)
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Menu</h3>
      <form onSubmit={handleCreateMenuItem} className="admin-form">
        <input
          type="text"
          placeholder="Menu Title"
          value={newMenuItem.title}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category ID"
          value={newMenuItem.categoryId}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, categoryId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Icon"
          value={newMenuItem.icon}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, icon: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newMenuItem.isMegaMenu}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, isMegaMenu: e.target.checked })}
          />
          Show in Mega Menu
        </label>
        <label>
          <input
            type="checkbox"
            checked={newMenuItem.isFeatured}
            onChange={(e) => setNewMenuItem({ ...newMenuItem, isFeatured: e.target.checked })}
          />
          Featured
        </label>
        <button type="submit" className="btn-submit">
          Create Menu Item
        </button>
      </form>
    </div>
  )
}
