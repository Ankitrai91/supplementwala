'use client';

import { useState, useEffect } from 'react'
import '../styles/ProfileEditPage.css'
// import { updateUserProfile, getUserProfile } from '../services/userService'
import { userService } from '../services/userService.js'

export default function ProfileEditPage() {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile()
        setFormData({
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          pincode: profile.pincode || '',
        })
      } catch (error) {
        setMessage('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      await userService.updateProfile(formData)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="profile-edit-loader">Loading profile...</div>
  }

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-header">
        <h1>Edit Profile</h1>
        <p>Update your personal information</p>
      </div>

      <form className="profile-edit-form" onSubmit={handleSubmit}>
        {message && (
          <div
            className={`message ${message.includes('Failed') ? 'error' : 'success'}`}
          >
            {message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            pattern="[0-9]{10}"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              pattern="[0-9]{6}"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/account/dashboard" className="btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
