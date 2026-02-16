import axiosClient from "../api/axiosClient"

export const authService = {
  register: (data) => axiosClient.post("/auth/register", data),
  login: (data) => axiosClient.post("/auth/login", data),
  getProfile: () => axiosClient.get("/auth/profile"),
  updateProfile: (data) => axiosClient.put("/auth/profile", data),
}
