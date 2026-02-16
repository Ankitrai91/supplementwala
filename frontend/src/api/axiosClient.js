import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  console.log("Axios token:", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


// response interceptor (optional)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default axiosClient   // ✅ THIS IS THE KEY
