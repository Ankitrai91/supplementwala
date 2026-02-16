import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearAuth } from "../store/slices/authSlice"

const AdminHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(clearAuth())
    navigate("/login") // or "/"
  }

  return (
    <div className="admin-header">
      <h2>Admin Panel</h2>

      <button className="admin-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default AdminHeader
