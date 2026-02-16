'use client';

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authService } from '../services/authService'
import { userService } from '../services/userService'
import { setAuth, setUser } from '../store/slices/authSlice'
import './AuthPages.css'

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log("[v0] Attempting login with email:", formData.email)
      const response = await authService.login({email:formData.email, password:formData.password})
      
      console.log("[v0] Login response received:", response.data)
      
      // Store token
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Update Redux with auth data
      dispatch(setAuth({
        user: response.data.user,
        token: response.data.token,
      }))

      console.log("[v0] Fetching complete profile data")
      
      // Fetch complete profile to update Redux
    //   try {
    //     const profileResponse = await userService.getProfile()
    //     console.log("[v0] Profile fetched successfully:", profileResponse.data)
    //     dispatch(setUser(profileResponse.data))
    //   } catch (profileError) {
    //     console.warn("[v0] Could not fetch complete profile, using login data:", profileError)
    //   }

    dispatch(setAuth({
  user: response.data.user,
  token: response.data.token,
}))

if(response.data.user.role == "admin"){

  navigate('/admin')}else{


      navigate('/account/dashboard')
  }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        <p className="subtitle">Sign in to your NutriStar account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <p><Link to="/">Back to Home</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
