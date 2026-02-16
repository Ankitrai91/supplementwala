import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {store} from './store/store'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfileEditPage from './pages/ProfileEditPage'
import WalletPage from './pages/WalletPage'
import BrandsPage from './pages/BrandsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import OrdersPage from './pages/OrdersPage'
import { clearAuth } from './store/slices/authSlice'
import './App.css'
import AdminDashboard from './pages/AdminDashboard'
import CategoriesPage from './pages/CategoriesPage'
// import Shop from './pages/DashboardPage'
import Shop from './pages/Shop.jsx'
import Footer from './components/Footer.jsx'

function AppContent() {
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(clearAuth())
    window.location.href = '/'
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/dashboard" element={<DashboardPage />} />
          <Route path="/account/profile/edit" element={<ProfileEditPage />} />
          <Route path="/account/wallet" element={<WalletPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/brand/:slug" element={<BrandsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/shop" element={<Shop/>} />

          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer/>
      </main>
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

export default App
